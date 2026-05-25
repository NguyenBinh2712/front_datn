import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Send } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { fetchMessages, markSeenRest, sendMessageMultipart, typingRest } from '@/api/chat'
import { fetchMyConversations } from '@/api/conversation'
import { getMe } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChatEvent, MessageResponse } from '@/types/models'
import { useStomp } from '@/ws/stomp-context'

export function ChatPage() {
  const { convId } = useParams()
  const navigate = useNavigate()

  const convs = useQuery({
    queryKey: ['conversations', 'list'],
    queryFn: () => fetchMyConversations(0, 40),
  })

  if (!convId) {
    return (
      <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[280px_1fr]">
        <Card className="space-y-2 p-4">
          <h1 className="mb-2 font-semibold">Hội thoại</h1>
          {(convs.data?.content ?? []).map((c) => (
            <Link
              key={c.id}
              to={`/chat/${c.id}`}
              className="block rounded-xl border border-transparent px-3 py-2 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:border-indigo-900 dark:hover:bg-indigo-950/40"
            >
              <div className="font-medium">{c.name || `DM #${c.id}`}</div>
              <div className="truncate text-xs text-slate-500">{c.lastMessagePreview}</div>
            </Link>
          ))}
          {!convs.data?.content.length ? (
            <p className="text-sm text-slate-500">Chưa có cuộc trò chuyện.</p>
          ) : null}
          <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/users')}>
            Tìm user để nhắn
          </Button>
        </Card>
        <Card className="flex min-h-[360px] items-center justify-center text-slate-500">
          Chọn một cuộc trò chuyện bên trái
        </Card>
      </div>
    )
  }

  const id = Number(convId)
  if (!Number.isFinite(id)) return <p>Invalid</p>

  return (
    <div className="mx-auto grid max-w-5xl gap-4 lg:grid-cols-[260px_1fr]">
      <Card className="hidden max-h-[70vh] space-y-2 overflow-auto p-3 lg:block">
        {(convs.data?.content ?? []).map((c) => (
          <Link
            key={c.id}
            to={`/chat/${c.id}`}
            className={`block rounded-xl px-3 py-2 text-sm ${
              c.id === id
                ? 'bg-indigo-600 text-white'
                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {c.name || `Chat ${c.id}`}
          </Link>
        ))}
      </Card>
      <ChatRoom convId={id} />
    </div>
  )
}

function ChatRoom({ convId }: { convId: number }) {
  const qc = useQueryClient()
  const me = useQuery({ queryKey: ['me'], queryFn: getMe })
  const { subscribe, publishJson, connected } = useStomp()
  const [draft, setDraft] = useState('')
  const [typingHint, setTypingHint] = useState('')
  const typingTimer = useRef<number | null>(null)

  const msgs = useInfiniteQuery({
    queryKey: ['messages', convId],
    queryFn: ({ pageParam }) => fetchMessages(convId, pageParam as number, 30),
    initialPageParam: 0,
    getNextPageParam: (last, _p, param) => (last.last ? undefined : (param as number) + 1),
  })

  const flat = useMemo(
    () =>
      (msgs.data?.pages.flatMap((p) => p.content) ?? []).slice().sort((a, b) =>
        a.timestamp < b.timestamp ? -1 : 1,
      ),
    [msgs.data],
  )

  useEffect(() => {
    if (!connected) return
    publishJson(`/app/chat.seen/${convId}`, {})
    void markSeenRest(convId).catch(() => {})
  }, [connected, convId, publishJson])

  useEffect(() => {
    const unsub = subscribe(`/topic/conversation.${convId}`, (message) => {
      try {
        const evt = JSON.parse(message.body) as ChatEvent
        if (
          evt.type === 'MESSAGE' ||
          evt.type === 'EDIT' ||
          evt.type === 'DELETE' ||
          evt.type === 'REACTION'
        ) {
          void qc.invalidateQueries({ queryKey: ['messages', convId] })
        }
        if (evt.type === 'TYPING' && evt.userId !== me.data?.id) {
          setTypingHint(`User ${evt.userId} đang gõ…`)
          window.setTimeout(() => setTypingHint(''), 2500)
        }
      } catch {
        /* noop */
      }
    })
    return unsub
  }, [convId, me.data?.id, qc, subscribe])

  useEffect(() => {
    const unsub = subscribe('/topic/presence', (_message) => {
      void qc.invalidateQueries({ queryKey: ['conversations', 'list'] })
    })
    return unsub
  }, [qc, subscribe])

  async function send() {
    const text = draft.trim()
    if (!text) return
    if (connected) {
      publishJson(`/app/chat.send/${convId}`, { conversationId: convId, content: text })
    } else {
      await sendMessageMultipart({ conversationId: convId, content: text })
    }
    setDraft('')
    void qc.invalidateQueries({ queryKey: ['messages', convId] })
  }

  function onTyping() {
    if (typingTimer.current) window.clearTimeout(typingTimer.current)
    if (connected) publishJson(`/app/chat.typing/${convId}`, {})
    else void typingRest(convId)
    typingTimer.current = window.setTimeout(() => {
      typingTimer.current = null
    }, 800)
  }

  return (
    <Card className="flex max-h-[75vh] flex-col">
      <div className="border-b border-slate-100 p-3 text-sm dark:border-slate-800">
        Phòng #{convId} · STOMP{' '}
        <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">/topic/conversation.{convId}</code>{' '}
        {connected ? (
          <span className="text-emerald-600">live</span>
        ) : (
          <span className="text-amber-600">fallback REST</span>
        )}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={!msgs.hasNextPage || msgs.isFetchingNextPage}
          onClick={() => void msgs.fetchNextPage()}
        >
          {msgs.isFetchingNextPage ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tải tin cũ hơn'}
        </Button>
        {msgs.isLoading ? <Skeleton className="h-20 w-full" /> : null}
        {flat.map((m) => (
          <MessageBubble key={m.id} m={m} selfId={me.data?.id} />
        ))}
        {typingHint ? <div className="text-xs italic text-slate-500">{typingHint}</div> : null}
      </div>
      <div className="flex gap-2 border-t border-slate-100 p-3 dark:border-slate-800">
        <Input
          value={draft}
          placeholder="Nhập tin nhắn…"
          onChange={(e) => {
            setDraft(e.target.value)
            onTyping()
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              void send()
            }
          }}
        />
        <Button type="button" onClick={() => void send()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}

function MessageBubble({ m, selfId }: { m: MessageResponse; selfId?: number }) {
  const mine = m.senderId === selfId
  return (
    <div className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
          mine
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100'
        }`}
      >
        <div className="text-[10px] opacity-80">#{m.senderId}</div>
        <div className="whitespace-pre-wrap">{m.content}</div>
        <div className="mt-1 text-[10px] opacity-70">
          {new Date(m.timestamp).toLocaleTimeString()} {m.isEdited ? '· đã sửa' : ''}
        </div>
      </div>
    </div>
  )
}
