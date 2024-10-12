import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { updateHolding } from '@/lib/api/holdingApi'

interface ConfirmationModal {
  openConfirmationModal: boolean
  setOpenConfirmationModal: (value: boolean) => void
  sold: boolean
  holding_id: string
}

const ConfirmationModal = ({
    
  openConfirmationModal,
  setOpenConfirmationModal,
  sold,
  holding_id,
}: ConfirmationModal): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const validationSchema = Yup.object().shape({
    sellQuantity: Yup.string().required('SellQuantity is required'),
    sellPrice: Yup.string().required('SellPrice is required'),
  })

  const formOptions = { resolver: yupResolver(validationSchema) }

  const form = useForm(formOptions)
  const { register, handleSubmit, reset, formState: { errors } } = form

  const updateUserHolding = async (
    sold: boolean,
    holding_id: string,
    sellQuantity: string,
    sellPrice: string
  ) => {
    setIsLoading(true)
    try {
      const res = await updateHolding(sold, holding_id, sellQuantity, sellPrice)
      if (res?.data?.statusCode === 200) {
        toast({
          description: 'Holding Updated Successfully',
          variant: 'default',
        })
        handleModalClose()
      }
    } catch (err) {
      handleModalClose()
    }
    setIsLoading(false)
  }

  const handleModalClose = () => {
    reset()
    setOpenConfirmationModal(false)
  }

  const onSubmit = handleSubmit(async (data) => {
    updateUserHolding(sold, holding_id, data.sellQuantity, data.sellPrice)
  })

  return (
    <Dialog open={openConfirmationModal} onOpenChange={setOpenConfirmationModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="sellQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sell Quantity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter a Quantity"
                    />
                  </FormControl>
                  <FormMessage>{errors?.sellQuantity?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellPrice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sell Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      step="any"
                      min="0"
                      placeholder="Enter a Price"
                    />
                  </FormControl>
                  <FormMessage>{errors?.sellPrice?.message}</FormMessage>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button variant="outline" onClick={handleModalClose}>
                Close
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Loading...' : 'Confirm'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationModal
