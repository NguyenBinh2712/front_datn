import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { Toaster } from 'sonner'
import { createQueryClient } from '@/lib/query-client'
import { AppRouter } from '@/routes/router'
import { StompProvider } from '@/ws/stomp-context'

const qc = createQueryClient()

export function AppProviders() {
  return (
    <StrictMode>
      <QueryClientProvider client={qc}>
        <StompProvider>
          <AppRouter />
          <Toaster richColors closeButton position="top-center" />
        </StompProvider>
      </QueryClientProvider>
    </StrictMode>
  )
}
