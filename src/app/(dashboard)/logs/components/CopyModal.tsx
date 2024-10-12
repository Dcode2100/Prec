import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Log } from '@/lib/types/getAllLogsType'
import { Copy } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LogModalProps {
  log: Log | null
  isOpen: boolean
  onClose: () => void
}

const LogModal: React.FC<LogModalProps> = ({ log, isOpen, onClose }) => {
  const { toast } = useToast()

  const copyToClipboard = () => {
    if (log?.log) {
      navigator.clipboard.writeText(JSON.stringify(log, null, 2))
      onClose()
      toast({
        title: 'Copied to clipboard',
        description: 'The log has been copied to your clipboard.',
        variant: 'success',
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw] sm:max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Log Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex-grow overflow-hidden">
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-[60vh] text-xs whitespace-pre-wrap break-words">
            {log?.log ? JSON.stringify(log.log, null, 2) : 'No log selected'}
          </pre>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={copyToClipboard}
            className="flex items-center gap-2 hover:bg-highlight-blue"
            disabled={!log?.log}
            title={
              log?.log ? 'Copy log to clipboard' : 'No log available to copy'
            }
          >
            <Copy size={16} />
            {log?.log ? 'Copy to Clipboard' : 'No Log to Copy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default LogModal
