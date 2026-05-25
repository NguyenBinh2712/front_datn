import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeMode = 'light' | 'dark' | 'system'

type ThemeState = {
  mode: ThemeMode
  setMode: (m: ThemeMode) => void
}

function applyDom(mode: ThemeMode): void {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const dark = mode === 'dark' || (mode === 'system' && prefersDark)
  root.classList.toggle('dark', dark)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      setMode: (mode) => {
        set({ mode })
        applyDom(mode)
      },
    }),
    { name: 'datn-theme' },
  ),
)

useThemeStore.persist.onFinishHydration(() => {
  applyDom(useThemeStore.getState().mode)
})

applyDom(useThemeStore.getState().mode)

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (useThemeStore.getState().mode === 'system') applyDom('system')
})
