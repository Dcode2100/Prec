import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import moment from 'moment'

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

import { ApplyRightIssue } from '@/lib/api/api'
import { ApplyRightIssueParams } from '@/lib/types/types'

interface ApplyRightsIssueModal {
  openApplyRightsIssueModal: boolean
  setOpenApplyRightsIssueModal: (value: boolean) => void
  holding_id: string
  accountId: string
}

const ApplyRightsIssueModal = ({
  openApplyRightsIssueModal,
  setOpenApplyRightsIssueModal,
  holding_id,
  accountId,
}: ApplyRightsIssueModal): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const validationSchema = Yup.object().shape({
    quantity: Yup.string().required('Quantity is required'),
    price: Yup.string().required('Price is required'),
  })

  const formOptions = { resolver: yupResolver(validationSchema) }

  const form = useForm(formOptions)
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = form

  const [orderCreatedDate, setOrderCreatedDate] = useState('')
  const [paymentDate, setPaymentDate] = useState('')
  const [sharesTransferredDate, setSharesTransferredDate] = useState('')

  const applyRightsIssue = async (data: ApplyRightIssueParams) => {
    setIsLoading(true)
    const params: ApplyRightIssueParams = {
      investorId: accountId,
      quantity: data?.quantity,
      price: data?.price,
      orderCreatedDate: orderCreatedDate,
      paymentDate: paymentDate,
      sharesTransferredDate: sharesTransferredDate,
    }
    try {
      const res = await ApplyRightIssue(params, holding_id)
      if (res?.data?.statusCode === 200) {
        toast.toast({
          description: 'Holding Updated Successfully',
          variant: 'success',
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
    setOpenApplyRightsIssueModal(false)
  }

  const onSubmit = handleSubmit(async (data) => {
    applyRightsIssue(data as ApplyRightIssueParams)
  })

  return (
    <Dialog
      open={openApplyRightsIssueModal}
      onOpenChange={setOpenApplyRightsIssueModal}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter a Quantity"
                    />
                  </FormControl>
                  <FormMessage>{errors?.quantity?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      step="any"
                      type="number"
                      placeholder="Enter a Price"
                    />
                  </FormControl>
                  <FormMessage>{errors?.price?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="orderCreatedDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order Created Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      max={`${moment(new Date()).format('YYYY-MM-DDTHH:mm')}`}
                      onChange={(e) => {
                        setOrderCreatedDate(
                          moment(new Date(e.target.value))
                            .toISOString()
                            .split('.')[0] + 'Z'
                        )
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      max={`${moment(new Date()).format('YYYY-MM-DDTHH:mm')}`}
                      onChange={(e) => {
                        setPaymentDate(
                          moment(new Date(e.target.value))
                            .toISOString()
                            .split('.')[0] + 'Z'
                        )
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sharesTransferredDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shares Transferred Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="datetime-local"
                      max={`${moment(new Date()).format('YYYY-MM-DDTHH:mm')}`}
                      onChange={(e) => {
                        setSharesTransferredDate(
                          moment(new Date(e.target.value))
                            .toISOString()
                            .split('.')[0] + 'Z'
                        )
                        field.onChange(e)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
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

export default ApplyRightsIssueModal
