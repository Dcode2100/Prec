import { useToast } from '@/hooks/use-toast'
import { CopyIcon } from 'lucide-react'
import { useState } from 'react'

export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

export default function CopyableCell({ value }: { value: string }) {
  const [showCopyIcon, setShowCopyIcon] = useState(false)
  const { toast } = useToast()

  const handleCopy = () => {
    copyToClipboard(value)
    toast({
      title: 'Copied to clipboard',
      description: `"${value}" has been copied to your clipboard.`,
      variant: 'success',
      duration: 3000,
    })
  }

  return (
    <div
      onClick={handleCopy}
      onMouseEnter={() => setShowCopyIcon(true)}
      onMouseLeave={() => setShowCopyIcon(false)}
      className="cursor-pointer flex items-center text-highlight-blue font-semibold hover:bg-gray-100 p-1 rounded relative w-full"
      title="Click to copy"
    >
      <span className="pr-6 truncate w-full text-sm">{value}</span>
      {showCopyIcon && (
        <CopyIcon className="w-4 h-4 absolute right-1 top-1/2 transform -translate-y-1/2" />
      )}
    </div>
  )
}
