import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { UploadBulkPanDocument } from '@/lib/api/deliveryApi'
interface UploadBulkPanProps {
  buttonText: string
}

function UploadBulkPan({ buttonText }: UploadBulkPanProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [fileSize] = useState(100004800)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(false)

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]

      if (file.type !== 'text/csv') {
        toast({
          title: 'Invalid File Format',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        })
        return
      }

      if (file.size >= fileSize) {
        toast({
          title: 'File Too Large',
          description: 'The file size exceeds the maximum limit.',
          variant: 'destructive',
        })
        return
      }

      const formData = new FormData()
      formData.append('pan_updates', file)
      formData.append('log_file_name', 'pan')

      setIsLoading(true)
      try {
        const upload = await UploadBulkPanDocument(formData)
        if (upload?.statusCode === 200) {
          toast({
            title: 'Upload Successful',
            description: 'Your file has been uploaded successfully.',
            variant: 'success',
          })
        } else {
          throw new Error('Upload failed')
        }
      } catch (err) {
        toast({
          title: 'Upload Failed',
          description:
            'There was an error uploading your file. Please try again.',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="cursor-pointer h-8">
      <div className="flex h-8 items-center justify-center">
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          onChange={handleUpload}
          disabled={isLoading}
          accept=".csv"
        />
        <Button asChild disabled={isLoading} className="h-8">
          <label htmlFor="file-upload">
            {isLoading ? 'Uploading...' : buttonText}
          </label>
        </Button>
      </div>
    </div>
  )
}

export default UploadBulkPan
