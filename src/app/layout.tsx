import './globals.css'

import { Toaster } from '@/components/ui/toaster'
import StoreProvider from './StoreProvider'
import ThemeProvider from '@/components/layouts/ThemeToggle/theme-provider'
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class">
          <StoreProvider count={0}>{children}</StoreProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
