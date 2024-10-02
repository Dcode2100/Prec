import * as React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useToast } from '@/hooks/use-toast'
import { CopyIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CopyButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  name?: string
  iconSide?: 'left' | 'right'
  showTooltip?: boolean
  isTruncated?: boolean
}

export function CopyButton({
  value,
  name,
  iconSide = 'right',
  showTooltip = false,
  isTruncated = false,
  className,
  ...props
}: CopyButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { toast } = useToast()

  const copyValue = () => {
    navigator.clipboard.writeText(value)
    toast({
      description: `${name || 'Value'} copied`,
    })
  }

  const buttonContent = (
    <>
      {iconSide === 'left' && isHovered && (
        <CopyIcon className="mr-2 h-4 w-4" />
      )}
      <span className={cn('truncate', { 'max-w-full': !isTruncated })}>
        {value || '—'}
      </span>
      {iconSide === 'right' && isHovered && (
        <CopyIcon className="ml-2 h-4 w-4" />
      )}
    </>
  )

  const button = (
    <Button
      type="button"
      variant="ghost"
      className={cn('min-w-content justify-start', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={copyValue}
      disabled={!value}
      {...props}
    >
      {buttonContent}
    </Button>
  )

  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>{value}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return button
}
