/** Parse Jackson LocalDateTime (string ISO hoặc mảng [y,m,d,h,mi,s]) */
export function parseJavaTime(input: unknown): number {
  if (typeof input === 'string') {
    const t = Date.parse(input)
    if (!Number.isNaN(t)) return t
  }
  if (Array.isArray(input)) {
    const [y, mo = 1, d = 1, h = 0, mi = 0, s = 0, ns = 0] = input.map((x) => Number(x))
    return new Date(y, mo - 1, d, h, mi, s, Math.floor(ns / 1e6)).getTime()
  }
  return Date.now()
}
