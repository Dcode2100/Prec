import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { UploadBulkAssets } from '@/lib/api/equityApi' // Adjust the import path as needed

const MAX_FILE_SIZE = 100004800 // ~95.4MB

interface UploadBulkAssetProps {
  buttonText?: string
  refetch?: () => void
}

export default function UploadBulkAsset({
  buttonText = 'Upload File',
  refetch = () => {},
}: UploadBulkAssetProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files
    if (!files || files.length === 0) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No file selected.',
      })
      return
    }

    const file = files[0]
    setIsLoading(true)

    if (file.type !== 'text/csv') {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'File format incorrect. Please upload a CSV file.',
      })
      setIsLoading(false)
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'File size exceeds the maximum limit of 95.4MB.',
      })
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('logFileName', 'assets')

    try {
      const response = await UploadBulkAssets(formData)
      if (response?.statusCode === 200) {
        toast({
          title: 'Success',
          description: 'Your file has been uploaded successfully.',
        })
        refetch()
      } else {
        throw new Error('Upload failed')
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          'An error occurred while uploading the file. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center">
      <Button
        variant="outline"
        size="sm"
        className="ml-auto h-8"
        disabled={isLoading}
      >
        {isLoading ? 'Uploading...' : buttonText}
        <input
          type="file"
          className="absolute opacity-0 inset-0 cursor-pointer"
          onChange={handleFileUpload}
          accept=".csv"
          disabled={isLoading}
        />
      </Button>
    </div>
  )
}
