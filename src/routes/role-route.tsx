import { type PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { hasRole } from '@/lib/jwt'
import { useAuthStore } from '@/stores/auth-store'

export function RoleRoute({
  role,
  children,
}: PropsWithChildren<{ role: string }>) {
  const token = useAuthStore((s) => s.token)
  if (!token) return <Navigate to="/login" replace />
  if (!hasRole(token, role)) return <Navigate to="/" replace />
  return children
}
