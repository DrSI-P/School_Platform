import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects | EdPsychConnect',
  description: 'Collaborate on AI-powered educational projects',
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}