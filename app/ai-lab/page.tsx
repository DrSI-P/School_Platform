import { Metadata } from 'next'
import AIWorkspace from '@/components/ai-lab/AIWorkspace'

export const metadata: Metadata = {
  title: 'AI Lab | EdPsychConnect',
  description: 'Experiment with AI and build your own educational tools',
}

export default function AILabPage() {
  return (
    <div className="min-h-screen bg-background">
      <AIWorkspace />
    </div>
  )
}