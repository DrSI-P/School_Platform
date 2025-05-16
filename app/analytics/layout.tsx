import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Analytics | EdPsychConnect',
  description: 'Track and analyze educational data with AI-powered insights',
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}