import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { CalendarIcon } from 'lucide-react'

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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

import { addFunds } from '@/lib/api/fundApi'
import { AddFundsParams } from '@/lib/types/types'

interface AddFundsModal {
  openAddFundsModal: boolean
  setOpenAddFundsModal: (value: boolean) => void
  getAccountRefetch: Function
  decentroWalletId: string
  accountId: string
}

const AddFundsModal = ({
  openAddFundsModal,
  setOpenAddFundsModal,
  getAccountRefetch,
  decentroWalletId,
  accountId,
}: AddFundsModal): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const [transactionType, setTransactionType] = useState('UPI')
  const { toast } = useToast()

  const [currentPaymentMode, setCurrentPaymentMode] = useState('')

  const validationSchema = Yup.object().shape({
    remitterName: Yup.string().required('RemitterName is required'),
    remitterAccountNumber: Yup.string().when('paymentMode', {
      is: (mode: string) =>
        mode === 'IMPS' || mode === 'NEFT' || mode === 'RTGS',
      then: Yup.string().required('RemitterAccountNumber is required'),
      otherwise: Yup.string().optional(),
    }),
    depositAmount: Yup.number()
      .transform((value) => (isNaN(value) ? null : value)) // Convert empty string to null
      .nullable() // Allow null values (empty or invalid input will be considered null)
      .required('DepositAmount is required')
      .typeError('DepositAmount must be a valid number')
      .min(1, 'DepositAmount must be greater than or equal to 1'),
    utr: Yup.string()
      .required('UTR is required')
      .matches(/^[a-zA-Z0-9]+$/, 'UTR must be alphanumeric'),
    paymentMode: Yup.string().required('PaymentMode is required'),
    createdAt: Yup.date()
      .transform((value, originalValue) => {
        const parsedDate = new Date(originalValue)
        if (parsedDate.toString() !== 'Invalid Date') {
          return parsedDate
        }
        return undefined
      })
      .required('Date is required'),
    remitterIfsc: Yup.string().when('paymentMode', {
      is: (mode: string) =>
        mode === 'IMPS' || mode === 'NEFT' || mode === 'RTGS',
      then: Yup.string()
        .required('Remitter IFSC is required')
        .matches(/^[a-zA-Z0-9]+$/, 'Remitter IFSC must be alphanumeric'),
      otherwise: Yup.string().optional(),
    }),
    vendor_transaction_id: Yup.string().when('paymentMode', {
      is: 'UPI',
      then: Yup.string().optional(),
      otherwise: Yup.string().optional(),
    }),
    upi_id: Yup.string().when('paymentMode', {
      is: 'UPI',
      then: Yup.string().required('UPI ID is required'),
      otherwise: Yup.string().optional(),
    }),
  })

  const upiValidationSchema = Yup.object().shape({
    transactionId: Yup.string().required('TransactionId is required'),
  })

  const formOptions = {
    resolver: yupResolver(
      transactionType === 'UPI' ? upiValidationSchema : validationSchema
    ),
  }

  const form = useForm(formOptions)
  const { watch, reset } = form
  const paymentMode = watch('paymentMode')

  const handleAddFunds = async (data: AddFundsParams) => {
    setIsLoading(true)
    try {
      const response = await addFunds(data, accountId ?? '')
      if (response?.statusCode === 200) {
        getAccountRefetch()
        toast({
          description: response.message,
          variant: 'default', // or "destructive" for error messages
        })
      }
    } catch (err: any) {
      toast({
        description: 'An error occurred while adding funds.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      handleModalClose()
    }
  }

  const handleModalClose = () => {
    reset()
    setTransactionType('UPI')
    setOpenAddFundsModal(false)
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const payload =
      transactionType === 'UPI'
        ? {
            creditMethod: transactionType,
            transactionId: data.transactionId,
          }
        : paymentMode === 'UPI'
        ? {
            creditMethod: transactionType,
            vendor_transaction_id: data?.vendor_transaction_id,
            utr: data.utr.toUpperCase(),
            amount: data?.depositAmount?.toString(),
            createdAt: data?.createdAt.toISOString(),
            paymentMode: data?.paymentMode,
            remitterName: data?.remitterName,
            upi_id: data?.upi_id,
            paymentRemark: data?.paymentRemark,
          }
        : {
            creditMethod: transactionType,
            utr: data.utr.toUpperCase(),
            amount: data?.depositAmount?.toString(),
            createdAt: data?.createdAt.toISOString(),
            paymentMode: data?.paymentMode,
            remitterName: data?.remitterName,
            remitterAccountNumber: data?.remitterAccountNumber,
            remitterIfsc: data?.remitterIfsc?.toUpperCase(),
            paymentRemark: data?.paymentRemark,
          }
    handleAddFunds(payload as AddFundsParams)
  })

  useEffect(() => {
    setCurrentPaymentMode(paymentMode)
  }, [paymentMode])

  return (
    <Dialog open={openAddFundsModal} onOpenChange={setOpenAddFundsModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Select Transaction Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        setTransactionType(value)
                        reset()
                        field.onChange(value)
                      }}
                      defaultValue="UPI"
                      className="flex flex-row space-x-4"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="UPI" />
                        </FormControl>
                        <FormLabel className="font-normal">UPI</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="BANK_TRANSFER" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Bank Transfer
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {transactionType === 'UPI' ? (
              <FormField
                control={form.control}
                name="transactionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a Transaction ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="utr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>UTR Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter UTR Number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(e.target.value.toUpperCase())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="depositAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Deposit Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="createdAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Created At</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          onChange={(e) =>
                            field.onChange(new Date(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Payment Mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            { paymentMode: 'IMPS' },
                            { paymentMode: 'NEFT' },
                            { paymentMode: 'RTGS' },
                            { paymentMode: 'UPI' },
                          ].map((el, idx) => (
                            <SelectItem key={idx} value={el.paymentMode}>
                              {el.paymentMode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="remitterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Remitter Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Remitter Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {currentPaymentMode === 'UPI' ? (
                  <FormField
                    control={form.control}
                    name="vendor_transaction_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vendor Transaction ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Vendor Transaction ID"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="remitterAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remitter Account Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Enter Remitter Account Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {currentPaymentMode === 'UPI' ? (
                  <FormField
                    control={form.control}
                    name="upi_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UPI ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter UPI ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <FormField
                    control={form.control}
                    name="remitterIfsc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remitter Ifsc</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Remitter Ifsc"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="paymentRemark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Remark</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Remark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

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

export default AddFundsModal