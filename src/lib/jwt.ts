export type JwtPayload = {
  sub?: string
  scope?: string
  userId?: number
  exp?: number
  iss?: string
}

export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const part = token.split('.')[1]
    if (!part) return null
    const json = atob(part.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json) as JwtPayload
  } catch {
    return null
  }
}

/** Scope backend: các role cách nhau bởi khoảng trắng */
export function getRolesFromToken(token: string | null): string[] {
  if (!token) return []
  const p = decodeJwtPayload(token)
  if (!p?.scope || typeof p.scope !== 'string') return []
  return p.scope.trim().split(/\s+/).filter(Boolean)
}

export function hasRole(token: string | null, role: string): boolean {
  return getRolesFromToken(token).includes(role)
}

/** Giáo viên hoặc admin */
export function isTeacherUser(token: string | null): boolean {
  if (!token) return false
  return hasRole(token, 'TEACHER') || hasRole(token, 'ADMIN')
}

/** Học sinh: có scope STUDENT, hoặc không phải TEACHER/ADMIN. */
export function isStudentUser(token: string | null): boolean {
  if (!token) return false
  if (hasRole(token, 'STUDENT')) return true
  return !hasRole(token, 'TEACHER') && !hasRole(token, 'ADMIN')
}

export function getHomePath(token: string | null): '/teacher' | '/' {
  return isTeacherUser(token) ? '/teacher' : '/'
}

export function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null
  const payload = decodeJwtPayload(token)
  if (typeof payload?.userId === 'number') return payload.userId
  if (payload?.sub) {
    const id = Number(payload.sub)
    if (Number.isFinite(id)) return id
  }
  return null
}
