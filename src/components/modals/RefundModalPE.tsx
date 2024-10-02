import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { processRefundAmount } from '@/lib/api/ordersApi'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface RefundModalProps {
  openRefundModal: boolean
  setOpenRefundModal: (value: boolean) => void
  order_id: string
  transactionAmount: number
  refetch?: () => void
  onClose: () => void
}

const RefundModal = ({
  openRefundModal,
  setOpenRefundModal,
  order_id,
  transactionAmount,
  refetch,
  onClose,
}: RefundModalProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validationSchema = Yup.object().shape({
    refundAmount: Yup.number()
      .required('Amount is required')
      .min(1, 'Minimum refund amount is 1')
      .max(transactionAmount, `Maximum refund amount is ${transactionAmount}`),
    note: Yup.string(),
  })

  const updateUserHolding = async (
    order_id: string,
    refundAmount: string,
    note: string
  ) => {
    setIsLoading(true)
    try {
      const res = await processRefundAmount(order_id, refundAmount, note)
      if (res?.statusCode === 200) {
        toast({
          title: res?.message,
          variant: 'success',
        })
        refetch?.()
        onClose()
        handleModalClose()
      }
    } catch (err) {
      handleModalClose()
    }
    setIsLoading(false)
  }

  const handleModalClose = () => {
    setOpenRefundModal(false)
  }

  return (
    <Dialog open={openRefundModal} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogDescription>
            Are You Sure You Want To Proceed?
          </DialogDescription>
        </DialogHeader>
        <Formik
          initialValues={{ refundAmount: transactionAmount, note: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            updateUserHolding(
              order_id,
              values.refundAmount.toString(),
              values.note
            )
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="refundAmount">Refund Amount</Label>
                  <Field
                    as={Input}
                    id="refundAmount"
                    name="refundAmount"
                    type="number"
                    min={1}
                    step="any"
                    max={transactionAmount}
                    placeholder="Enter Refund Amount"
                  />
                  {errors.refundAmount && touched.refundAmount && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.refundAmount}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="note">Note</Label>
                  <Field
                    as={Input}
                    id="note"
                    name="note"
                    type="text"
                    placeholder="Note"
                  />
                </div>
              </div>
              <DialogFooter className="mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                >
                  Close
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Processing...' : 'Confirm'}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

export default RefundModal
