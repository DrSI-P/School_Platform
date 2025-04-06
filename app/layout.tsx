import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/layout/Navigation'
import { Toaster } from '@/components/ui/toaster'
import { Providers } from '@/app/providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'EdPsychConnect',
  description: 'An advanced educational platform connecting educational psychologists, educators, and students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navigation />
          <main className="py-4">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}