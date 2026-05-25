import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { changePassword, getMe, updateProfile, uploadAvatar } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'

const schema = z.object({
  fullName: z.string().min(2),
  bio: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ProfilePage() {
  const qc = useQueryClient()
  const me = useQuery({ queryKey: ['me'], queryFn: getMe })

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    values: {
      fullName: me.data?.profile?.fullName ?? '',
      bio: me.data?.profile?.bio ?? '',
    },
  })

  const save = useMutation({
    mutationFn: (body: FormValues) => updateProfile(body),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['me'] }),
  })

  const pwd = useMutation({
    mutationFn: (body: { oldPassword: string; newPassword: string }) => changePassword(body),
  })

  const pwdForm = useForm<{ oldPassword: string; newPassword: string }>()

  const avatar = useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ['me'] }),
  })

  if (me.isLoading) return <Skeleton className="mx-auto h-96 max-w-xl" />

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Hồ sơ</h1>
      <Card className="flex flex-col items-center gap-4 sm:flex-row">
        <img
          src={me.data?.profile?.avatarUrl || '/icons.svg'}
          alt=""
          className="h-24 w-24 rounded-full border border-slate-200 object-cover dark:border-slate-700"
        />
        <div>
          <div className="font-semibold">{me.data?.profile?.fullName}</div>
          <div className="text-sm text-slate-500">{me.data?.email}</div>
          <label className="mt-2 inline-flex cursor-pointer items-center gap-2 text-sm text-indigo-600">
            Đổi avatar
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) avatar.mutate(f)
              }}
            />
          </label>
        </div>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-medium">Cập nhật thông tin</h2>
        <form className="space-y-3" onSubmit={form.handleSubmit((v) => save.mutate(v))}>
          <div>
            <label className="text-sm font-medium">Họ tên</label>
            <Input {...form.register('fullName')} />
          </div>
          <div>
            <label className="text-sm font-medium">Bio</label>
            <Input {...form.register('bio')} />
          </div>
          <Button type="submit" disabled={save.isPending}>
            Lưu
          </Button>
        </form>
      </Card>

      <Card className="space-y-4">
        <h2 className="font-medium">Đổi mật khẩu</h2>
        <form
          className="space-y-3"
          onSubmit={pwdForm.handleSubmit((v) => pwd.mutate(v))}
        >
          <Input type="password" placeholder="Mật khẩu cũ" {...pwdForm.register('oldPassword')} />
          <Input type="password" placeholder="Mật khẩu mới" {...pwdForm.register('newPassword')} />
          <Button type="submit" disabled={pwd.isPending}>
            Đổi mật khẩu
          </Button>
        </form>
      </Card>
    </div>
  )
}
