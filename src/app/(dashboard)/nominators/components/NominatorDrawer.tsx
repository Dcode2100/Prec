import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { createNominator, updateNominator } from '@/lib/api/nominatorApi'
import { GenericResponseWithMessage } from '@/lib/types/types'

interface Nominator {
  nominator_id?: string
  name: string
  code: string
  logo: string
  status: boolean
  created_at?: string
  updated_at?: string
}

interface NominatorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: Nominator | null
  isLoading?: boolean
}

const NominatorSheet = ({
  open,
  onOpenChange,
  initialData,
  isLoading = false,
}: NominatorSheetProps) => {
  const [formData, setFormData] = useState<{
    name: string
    code: string
    status: boolean
  }>({
    name: '',
    code: '',
    status: false,
  })
  const [previewImg, setPreviewImg] = useState<string | null>(null)
  const [fileToUpload, setFileToUpload] = useState<File | null>(null)
  const [errors, setErrors] = useState<{
    name?: string
    code?: string
    logo?: string
  }>({})
  const { toast } = useToast()

  useEffect(() => {
    if (open && initialData) {
      setFormData({
        name: initialData.name,
        code: initialData.code,
        status: initialData.status,
      })
      setPreviewImg(initialData.logo)
    }
  }, [open, initialData])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.code.trim()) {
      newErrors.code = 'Code is required'
    }
    if (!initialData && !fileToUpload && !previewImg) {
      newErrors.logo = 'Logo is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleImageValidation = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new window.Image()
        img.onload = () => {
          const isValid = img.width === 336 && img.height === 336
          if (!isValid) {
            setErrors((prev) => ({
              ...prev,
              logo: 'Logo resolution must be 336x336 pixels',
            }))
          } else {
            setErrors((prev) => ({ ...prev }))
          }
          resolve(isValid)
        }
        img.onerror = () => {
          setErrors((prev) => ({
            ...prev,
            logo: 'Invalid image file',
          }))
          resolve(false)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const isValid = await handleImageValidation(file)
    if (isValid) {
      setFileToUpload(file)
      setPreviewImg(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const submitData = new FormData()
    submitData.append('name', formData.name)
    submitData.append('code', formData.code)
    submitData.append('status', String(formData.status))
    if (fileToUpload) {
      submitData.append('logo', fileToUpload)
    }

    try {
      let response: GenericResponseWithMessage
      if (initialData) {
        response = await updateNominator(
          initialData.nominator_id as string,
          submitData
        )
      } else {
        response = await createNominator(submitData)
      }
      if (response.statusCode === 200 || response.statusCode === 201) {
        handleClose()
        toast({
          description: `Nominator successfully ${
            initialData ? 'updated' : 'created'
          }`,
          variant: 'success',
        })
      }
    } catch (error) {
      toast({
        description: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const handleClose = () => {
    setFormData({ name: '', code: '', status: false })
    setPreviewImg(null)
    setFileToUpload(null)
    setErrors({})
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{initialData ? 'Edit' : 'Create'} Nominator</SheetTitle>
          <SheetDescription>
            {initialData ? 'Edit existing' : 'Add a new'} nominator to the
            system.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="logo"
                type="file"
                accept="image/png, image/jpg, image/jpeg"
                onChange={handleFileChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo')?.click()}
              >
                Attach file
              </Button>
              {previewImg && (
                <div className="relative">
                  <Image
                    src={previewImg}
                    alt="Preview"
                    width={336}
                    height={336}
                    className="h-16 w-16 object-contain"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2"
                    onClick={() => {
                      setPreviewImg(null)
                      setFileToUpload(null)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {errors.logo && (
              <p className="text-red-500 text-sm">{errors.logo}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="Enter Code"
              className={errors.code ? 'border-red-500' : ''}
            />
            {errors.code && (
              <p className="text-red-500 text-sm">{errors.code}</p>
            )}
          </div>

          <div className="flex items-center justify-end space-x-2">
            <Label htmlFor="status">Status</Label>
            <Switch
              id="status"
              checked={formData.status}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, status: checked }))
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default NominatorSheet
