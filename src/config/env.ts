const raw = import.meta.env.VITE_API_URL ?? '/doan'

/** REST base (đã gồm context-path /doan) */
export const apiUrl = raw.replace(/\/$/, '')

/** ws://host/doan/ws-chat — native STOMP */
export function getStompBrokerUrl(): string {
  try {
    const u = new URL(apiUrl, window.location.origin)
    u.protocol = u.protocol === 'https:' ? 'wss:' : 'ws:'
    u.pathname = u.pathname.replace(/\/$/, '') + '/ws-chat'
    u.search = ''
    u.hash = ''
    return u.toString()
  } catch {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${wsProto}//${window.location.host}${apiUrl}/ws-chat`
  }
}
