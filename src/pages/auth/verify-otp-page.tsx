import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { resendOtp, verifyOtp } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email(),
  otp: z.string().min(4, 'Nhập mã OTP'),
})

type FormValues = z.infer<typeof schema>

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const emailFromState = (location.state as { email?: string } | null)?.email ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: emailFromState, otp: '' },
  })

  async function onSubmit(values: FormValues) {
    await verifyOtp({ email: values.email, otp: values.otp })
    toast.success('Xác thực thành công — vui lòng đăng nhập')
    navigate('/login', { replace: true })
  }

  async function resend() {
    const email = getValues('email')
    await resendOtp({ email, type: 'REGISTER' })
    toast.success('Đã gửi lại OTP')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Xác thực OTP</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Nhập mã được gửi tới email của bạn.
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
              <label className="mb-1 block text-sm font-medium">OTP</label>
              <Input {...register('otp')} />
              {errors.otp ? (
                <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
              ) : null}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              Xác nhận
            </Button>
          </form>
          <div className="flex justify-between text-sm">
            <button
              type="button"
              className="text-indigo-600 hover:underline dark:text-indigo-400"
              onClick={resend}
            >
              Gửi lại OTP
            </button>
            <Link className="text-indigo-600 hover:underline dark:text-indigo-400" to="/login">
              Về đăng nhập
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
