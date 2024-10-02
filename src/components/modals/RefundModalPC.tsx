import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useToast } from '@/hooks/use-toast'
import { processRefundAmountPC } from '@/lib/api/ordersApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface RefundModalProps {
  isOpen: boolean
  onClose: () => void
  order_id: string
  transactionAmount: number
  isProcessed: boolean
  dataUpdate: boolean
  setDataUpdate: (update: boolean) => void
}

const RefundModalPC = ({
  isOpen,
  onClose,
  order_id,
  transactionAmount,
  isProcessed,
  setDataUpdate,
  dataUpdate,
}: RefundModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const validationSchema = Yup.object().shape({
    refundAmount: Yup.string().required('Amount is required'),
    isRefundCredited: Yup.boolean(),
    transactionId: Yup.string().when('isRefundCredited', {
      is: true,
      then: (schema) =>
        schema.required('Transaction ID is required when refund is credited'),
    }),
    note: Yup.string(),
  })

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      refundAmount: transactionAmount.toString(),
      isRefundCredited: false,
      transactionId: '',
      note: '',
    },
  })

  const watchIsRefundCredited = watch('isRefundCredited')



  const onSubmit = async (data: any) => {
    setIsLoading(true)
    const processedData = {
      ...data,
      transactionId: data.isRefundCredited ? data.transactionId : null,
    }
    try {
      const res = await processRefundAmountPC(
        order_id,
        processedData.refundAmount,
        processedData.isRefundCredited || false,
        processedData.transactionId || null,
        processedData.note
      )
      if (res?.data?.statusCode === 200) {
        toast.toast({
          description: res?.data?.message,
          variant: 'success',
        })
        setDataUpdate(!dataUpdate)
        onClose()
      }
    } catch (err: any) {
      toast.toast({
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund Confirmation</DialogTitle>
          <DialogDescription>
            Please enter the refund details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="refundAmount">Refund Amount</Label>
            <Input
              id="refundAmount"
              {...register('refundAmount')}
              type="number"
              min={1}
              step="any"
              placeholder="Enter Refund Amount"
            />
            {errors.refundAmount && (
              <p className="text-sm text-red-500">
                {errors.refundAmount.message}
              </p>
            )}
          </div>

          {isProcessed && (
            <>
              <div className="flex items-center space-x-2">
                <Controller
                  name="isRefundCredited"
                  control={control}
                  render={({ field }) => (
                    <Switch
                      id="isRefundCredited"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="isRefundCredited">
                  Is refund already credited?
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionId">Transaction ID</Label>
                <Input
                  id="transactionId"
                  {...register('transactionId')}
                  type="text"
                  placeholder="Transaction ID"
                  disabled={!watchIsRefundCredited}
                  className={!watchIsRefundCredited ? 'bg-gray-100' : ''}
                />
                {errors.transactionId && (
                  <p className="text-sm text-red-500">
                    {errors.transactionId.message}
                  </p>
                )}
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="note">Note</Label>
            <Input
              id="note"
              {...register('note')}
              type="text"
              placeholder="Note"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default RefundModalPC
