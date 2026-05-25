import { Client, type IMessage } from '@stomp/stompjs'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { getStompBrokerUrl } from '@/config/env'
import { useAuthStore } from '@/stores/auth-store'

type Handler = (msg: IMessage) => void

type StompContextValue = {
  connected: boolean
  subscribe: (destination: string, handler: Handler) => () => void
  publishJson: (destination: string, body: unknown) => void
}

const StompContext = createContext<StompContextValue | null>(null)

export function StompProvider({ children }: { children: ReactNode }) {
  const token = useAuthStore((s) => s.token)
  const [connected, setConnected] = useState(false)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!token) {
      clientRef.current?.deactivate()
      clientRef.current = null
      setConnected(false)
      return
    }

    const client = new Client({
      brokerURL: getStompBrokerUrl(),
      reconnectDelay: 5000,
      heartbeatIncoming: 15000,
      heartbeatOutgoing: 15000,
      beforeConnect: () => {
        const t = useAuthStore.getState().token
        client.connectHeaders = t ? { Authorization: `Bearer ${t}` } : {}
      },
    })

    client.onConnect = () => setConnected(true)
    client.onDisconnect = () => setConnected(false)
    client.onWebSocketClose = () => setConnected(false)
    client.onStompError = () => setConnected(false)

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      if (clientRef.current === client) clientRef.current = null
      setConnected(false)
    }
  }, [token])

  const subscribe = useCallback((destination: string, handler: Handler) => {
    const c = clientRef.current
    if (!c?.connected) {
      return () => {}
    }
    const sub = c.subscribe(destination, handler)
    return () => {
      try {
        sub.unsubscribe()
      } catch {
        /* noop */
      }
    }
  }, [connected])

  const publishJson = useCallback((destination: string, body: unknown) => {
    const c = clientRef.current
    if (!c?.connected) return
    c.publish({
      destination,
      body: JSON.stringify(body),
      headers: { 'content-type': 'application/json' },
    })
  }, [connected])

  const value = useMemo<StompContextValue>(
    () => ({
      connected,
      subscribe,
      publishJson,
    }),
    [connected, publishJson, subscribe],
  )

  return <StompContext.Provider value={value}>{children}</StompContext.Provider>
}

export function useStomp(): StompContextValue {
  const ctx = useContext(StompContext)
  if (!ctx) throw new Error('useStomp must be inside StompProvider')
  return ctx
}
