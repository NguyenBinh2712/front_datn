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

export function getUserIdFromToken(token: string | null): number | null {
  if (!token) return null
  const id = decodeJwtPayload(token)?.userId
  return typeof id === 'number' ? id : null
}
