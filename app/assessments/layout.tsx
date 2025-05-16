import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Assessments | EdPsychConnect',
  description: 'Create and manage educational assessments with AI-powered analysis',
}

export default function AssessmentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}