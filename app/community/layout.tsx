import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Community | EdPsychConnect',
  description: 'Connect with educators, specialists, and students in our educational community',
}

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}