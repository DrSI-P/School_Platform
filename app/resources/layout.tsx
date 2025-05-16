import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resources | EdPsychConnect',
  description: 'Access AI-powered educational resources and materials',
}

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}