'use client'

import { useState, useEffect, useRef } from 'react'
import Editor from '@monaco-editor/react'

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  theme?: string
}

export function CodeEditor({
  value,
  onChange,
  language = 'javascript',
  theme = 'vs-dark',
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [mounted, setMounted] = useState(false)

  // Handle editor mounting
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor
    setMounted(true)
    
    // Set focus to the editor
    editor.focus()
  }

  // Handle value changes
  const handleEditorChange = (value: string | undefined) => {
    if (value !== undefined) {
      onChange(value)
    }
  }

  // Format code with Prettier
  const formatCode = () => {
    if (!editorRef.current) return
    
    // This would typically use Prettier, but for simplicity we're just
    // using the editor's built-in formatting
    editorRef.current.getAction('editor.action.formatDocument').run()
  }

  return (
    <div className="h-full w-full border rounded-md overflow-hidden">
      <Editor
        height="100%"
        width="100%"
        language={language}
        theme={theme}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          lineNumbers: 'on',
          glyphMargin: true,
          folding: true,
          lineDecorationsWidth: 10,
          renderLineHighlight: 'all',
        }}
      />
    </div>
  )
}