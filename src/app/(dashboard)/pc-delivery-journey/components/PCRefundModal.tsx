import { useToast } from '@/hooks/use-toast'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { processRefundAmountPC } from '@/lib/api/ordersApi'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface RefundModalProps {
  openRefundModal: boolean
  setOpenRefundModal: (value: boolean) => void
  order_id: string
  transactionAmount: number
  isProcessed: boolean
  refetch: () => void
}

const RefundModal = ({
  openRefundModal,
  setOpenRefundModal,
  order_id,
  transactionAmount,
  isProcessed,
  refetch,
}: RefundModalProps): React.ReactElement => {
  const { toast } = useToast()

  const validationSchema = Yup.object().shape({
    refundAmount: Yup.string().required('Amount is required'),
    isRefundCredited: Yup.boolean(),
    transactionId: Yup.string().when('isRefundCredited', {
      is: true,
      then: (schema) =>
        schema
          .required('Transaction ID is required when refund is credited')
          .matches(/^\d{10}$/, 'Transaction ID must be a 10-digit number'),
      otherwise: (schema) => schema.notRequired(),
    }),
    note: Yup.string(),
  })

  const handleModalClose = () => setOpenRefundModal(false)

  const handleSubmit = async (
    values,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    try {
      const res = await processRefundAmountPC(
        order_id,
        values.refundAmount,
        values.isRefundCredited,
        values.isRefundCredited ? values.transactionId : null,
        values.note
      )

      if (res?.data?.statusCode === 200) {
        toast({
          description: res?.data?.message,
          variant: 'success',
        })
        refetch()
        handleModalClose()
      }
    } catch (err) {
      toast({
        description: 'An error occurred. Please try again.',
        variant: 'destructive',
      })
      handleModalClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={openRefundModal} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Refund Confirmation</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            refundAmount: transactionAmount.toString(),
            isRefundCredited: false,
            transactionId: '',
            note: '',
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) =>
            handleSubmit(values, setSubmitting)
          }
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <div className="space-y-4">
                <RefundAmountField errors={errors} touched={touched} />
                {isProcessed && (
                  <>
                    <RefundCreditedSwitch />
                    <TransactionIdField
                      errors={errors}
                      touched={touched}
                      values={values}
                    />
                  </>
                )}
                <NoteField />
                <FormActions isSubmitting={isSubmitting} />
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}

const RefundAmountField = ({ errors, touched }) => (
  <div>
    <Label htmlFor="refundAmount">Refund Amount</Label>
    <Field
      as={Input}
      id="refundAmount"
      name="refundAmount"
      type="number"
      min={1}
      step="any"
      placeholder="Enter Refund Amount"
    />
    {errors.refundAmount && touched.refundAmount && (
      <p className="text-red-500 text-sm mt-1">{errors.refundAmount}</p>
    )}
  </div>
)

const RefundCreditedSwitch = () => (
  <div className="flex items-center space-x-2">
    <Field as={Switch} id="isRefundCredited" name="isRefundCredited" />
    <Label htmlFor="isRefundCredited">Is refund already credited?</Label>
  </div>
)

const TransactionIdField = ({ errors, touched, values }) => (
  <div>
    <Label htmlFor="transactionId">Transaction ID</Label>
    <Field
      as={Input}
      id="transactionId"
      name="transactionId"
      type="text"
      disabled={!values.isRefundCredited}
      placeholder="Transaction ID"
    />
    {errors.transactionId && touched.transactionId && (
      <p className="text-red-500 text-sm mt-1">{errors.transactionId}</p>
    )}
  </div>
)

const NoteField = () => (
  <div>
    <Label htmlFor="note">Note</Label>
    <Field as={Input} id="note" name="note" type="text" placeholder="Note" />
  </div>
)

const FormActions = ({ isSubmitting }) => (
  <div className="flex justify-end space-x-2">
    <DialogClose asChild>
      <Button variant="outline">Close</Button>
    </DialogClose>
    <Button type="submit" disabled={isSubmitting}>
      {isSubmitting ? 'Confirming...' : 'Confirm'}
    </Button>
  </div>
)

export default RefundModal
