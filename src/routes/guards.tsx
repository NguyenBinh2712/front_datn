import { Navigate } from 'react-router-dom'
import type { PropsWithChildren } from 'react'
import { useAuthStore } from '@/stores/auth-store'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  return children
}

export function GuestRoute({ children }: PropsWithChildren) {
  const token = useAuthStore((s) => s.token)
  if (token) return <Navigate to="/" replace />
  return children
}
