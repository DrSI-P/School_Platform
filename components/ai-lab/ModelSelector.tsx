'use client'

import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  selectedModel: string
  onSelectModel: (model: string) => void
}

// Available AI models
const models = [
  {
    value: 'gpt-4o',
    label: 'GPT-4o',
    description: 'Most capable model for complex tasks',
  },
  {
    value: 'gpt-3.5-turbo',
    label: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
  },
  {
    value: 'claude-3-opus',
    label: 'Claude 3 Opus',
    description: 'Advanced reasoning and instruction following',
  },
  {
    value: 'claude-3-sonnet',
    label: 'Claude 3 Sonnet',
    description: 'Balanced performance and efficiency',
  },
  {
    value: 'llama-3-70b',
    label: 'Llama 3 (70B)',
    description: 'Open source model with strong capabilities',
  },
  {
    value: 'code-llama-34b',
    label: 'Code Llama (34B)',
    description: 'Specialized for code generation and analysis',
  },
]

export function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  
  // Find the currently selected model
  const currentModel = models.find((model) => model.value === selectedModel) || models[0]
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {currentModel.label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandEmpty>No model found.</CommandEmpty>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={(currentValue) => {
                  onSelectModel(currentValue)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedModel === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.label}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}