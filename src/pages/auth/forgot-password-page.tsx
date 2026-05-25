import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { forgotPassword, requestForgotPasswordOtp, resendOtp } from '@/api/user'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email(),
  otp: z.string().min(4),
  newPassword: z.string().min(6),
})

type FormValues = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset'>('email')
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  async function requestOtp() {
    const email = getValues('email')
    if (!email) {
      toast.error('Nhập email')
      return
    }
    await requestForgotPasswordOtp(email)
    toast.success('OTP đã được gửi')
    setStep('reset')
  }

  async function onSubmit(values: FormValues) {
    await forgotPassword({
      email: values.email,
      otp: values.otp,
      newPassword: values.newPassword,
    })
    toast.success('Đặt lại mật khẩu thành công')
  }

  async function resend() {
    const email = getValues('email')
    await resendOtp({ email, type: 'FORGOT_PASSWORD' })
    toast.success('Đã gửi lại OTP')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 p-4 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="w-full max-w-md space-y-6 p-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Quên mật khẩu</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Bước 1: yêu cầu OTP · Bước 2: đặt mật khẩu mới
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
            {step === 'email' ? (
              <Button type="button" className="w-full" onClick={requestOtp}>
                Gửi OTP
              </Button>
            ) : null}
            {step === 'reset' ? (
              <>
                <div>
                  <label className="mb-1 block text-sm font-medium">OTP</label>
                  <Input {...register('otp')} />
                  {errors.otp ? (
                    <p className="mt-1 text-xs text-red-600">{errors.otp.message}</p>
                  ) : null}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Mật khẩu mới</label>
                  <Input type="password" {...register('newPassword')} />
                  {errors.newPassword ? (
                    <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
                  ) : null}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Đặt lại mật khẩu
                </Button>
                <button
                  type="button"
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
                  onClick={resend}
                >
                  Gửi lại OTP (FORGOT_PASSWORD)
                </button>
              </>
            ) : null}
          </form>
          <Link className="text-sm text-indigo-600 hover:underline dark:text-indigo-400" to="/login">
            Quay lại đăng nhập
          </Link>
        </Card>
      </motion.div>
    </div>
  )
}
