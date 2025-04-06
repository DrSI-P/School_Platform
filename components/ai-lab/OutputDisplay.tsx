'use client'

import { useEffect, useRef } from 'react'

interface OutputDisplayProps {
  output: string
}

export function OutputDisplay({ output }: OutputDisplayProps) {
  const outputRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight
    }
  }, [output])
  
  // Format output with syntax highlighting
  const formatOutput = (text: string) => {
    // Simple formatting for different types of output
    return text
      .split('\n')
      .map((line, index) => {
        // Highlight errors in red
        if (line.toLowerCase().includes('error')) {
          return `<span class="text-red-500">${line}</span>`
        }
        
        // Highlight warnings in yellow
        if (line.toLowerCase().includes('warning')) {
          return `<span class="text-yellow-500">${line}</span>`
        }
        
        // Highlight success messages in green
        if (
          line.toLowerCase().includes('success') ||
          line.toLowerCase().includes('passed')
        ) {
          return `<span class="text-green-500">${line}</span>`
        }
        
        // Format JSON output
        if (line.trim().startsWith('{') || line.trim().startsWith('[')) {
          try {
            const json = JSON.parse(line)
            return `<span class="text-blue-500">${JSON.stringify(
              json,
              null,
              2
            )}</span>`
          } catch (e) {
            // Not valid JSON, return as is
          }
        }
        
        return line
      })
      .join('\n')
  }
  
  return (
    <div
      ref={outputRef}
      className="h-full w-full bg-black text-white font-mono text-sm p-4 overflow-auto"
      dangerouslySetInnerHTML={{
        __html: formatOutput(output || 'Run your code to see output here...'),
      }}
    />
  )
}