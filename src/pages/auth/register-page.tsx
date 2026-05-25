import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { registerUser } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

const schema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirm: z.string().min(6),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirm'],
  })

type FormValues = z.infer<typeof schema>

export function RegisterPage() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function onSubmit(values: FormValues) {
    await registerUser({ email: values.email, password: values.password })
    navigate('/register/verify', { state: { email: values.email } })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Đăng ký</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Sau khi đăng ký, kiểm tra email để lấy OTP.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" {...register('email')} />
              {errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Mật khẩu</label>
              <Input type="password" {...register('password')} />
              {errors.password ? (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Xác nhận mật khẩu</label>
              <Input type="password" {...register('confirm')} />
              {errors.confirm ? (
                <p className="mt-1 text-xs text-red-600">{errors.confirm.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Đang gửi…' : 'Đăng ký'}
            </Button>
          </form>
          <Link className="text-sm text-indigo-600 hover:underline dark:text-indigo-400" to="/login">
            Đã có tài khoản?
          </Link>
        </Card>
      </motion.div>
    </div>
  )
}
