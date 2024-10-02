'use client'

import React, { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { UploadCSVDocuments } from '@/lib/api/mediaHandlerApi'
import { Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'

interface UploadCSVProps {
  status: string
  buttonText: string
  refetch?: () => void
}

function UploadCSV({ status, buttonText, refetch = () => {} }: UploadCSVProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [fileSizeAadhar] = useState(100004800)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChangeAadharWeb = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(false)
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.type === 'text/csv') {
        if (file.size < fileSizeAadhar) {
          const formData = new FormData()
          formData.append(
            status === 'PCACTIVE'
              ? 'accounts'
              : status === 'repay'
              ? 'holding'
              : 'order',
            file
          )
          formData.append('logFileName', 'orders')
          setIsLoading(true)
          try {
            const upload = await UploadCSVDocuments(formData, status)
            if (
              upload?.statusCode === 200 &&
              status !== 'SUBSCRIPTION_PROCESSED'
            ) {
              setIsLoading(false)
              toast({
                title: 'Upload Successful',
                description: 'Your CSV file has been uploaded.',
                variant: 'default',
              })
            }
            if (status === 'SUBSCRIPTION_PROCESSED') {
              toast({
                title: 'Upload Successful',
                description: 'Your CSV file has been uploaded.',
                variant: 'default',
              })
              refetch()
              setIsLoading(false)
            }
          } catch (err) {
            setIsLoading(false)
            toast({
              title: 'Upload Failed',
              description: 'There was an error uploading your file.',
              variant: 'destructive',
            })
          }
        } else {
          toast({
            title: 'File Size Exceeds Limit',
            description: 'Please upload a smaller file.',
            variant: 'destructive',
          })
        }
      } else {
        toast({
          title: 'Invalid File Format',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        })
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="cursor-pointer">
      <Button
        size="lg"
        className="w-full h-8 cursor-pointer"
        disabled={isLoading}
        onClick={handleButtonClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading
          </>
        ) : (
          buttonText
        )}
      </Button>
      <Input
        id="file-upload"
        type="file"
        className="hidden"
        disabled={isLoading}
        onChange={handleChangeAadharWeb}
        ref={fileInputRef}
        accept=".csv"
      />
    </div>
  )
}

export default UploadCSV
