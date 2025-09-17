import './globals.css'
import ThemeToggle from '@/app/components/ThemeToggle';
import { ThemeProvider } from 'next-themes'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simple Notes',
  description: 'A minimal notes app built with Next.js + MongoDB + Tailwind',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen max-w-3xl mx-auto px-4 py-6">
            <header className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">Simple Notes</h1>
              <ThemeToggle />
            </header>
            {children}
            <footer className="mt-10 text-sm opacity-70 text-center">
              Built with Next.js 14, MongoDB, Tailwind
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
