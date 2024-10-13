import { useEffect, useState } from 'react'
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Confirmation</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="transactionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Select Transaction Type</FormLabel>
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
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="UPI" />
                        </FormControl>
                        <FormLabel className="font-normal">UPI</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <RadioGroupItem value="BANK_TRANSFER" />
                        </FormControl>
                        <FormLabel className="font-normal">Bank Transfer</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
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
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {[
                  { name: "utr", label: "UTR Number", placeholder: "Enter UTR Number" },
                  { name: "remitterName", label: "Remitter Name", placeholder: "Enter Remitter Name" },
                  { name: "depositAmount", label: "Deposit Amount", placeholder: "Enter Deposit Amount" },
                  { name: "remitterAccountNumber", label: "Remitter Account Number", placeholder: "Enter Remitter Account Number" },
                  { name: "createdAt", label: "Created At", type: "datetime-local" },
                  { name: "remitterIfsc", label: "Remitter Ifsc", placeholder: "Enter Remitter Ifsc" },
                ].map((field) => (
                  <FormField
                    key={field.name}
                    control={form.control}
                    name={field.name as any}
                    render={({ field: formField }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">{field.label}</FormLabel>
                        <FormControl>
                          <Input
                            className="h-9"
                            type={field.type || "text"}
                            placeholder={field.placeholder}
                            {...formField}
                           
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                <FormField
                  control={form.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Payment Mode</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Payment Mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {["IMPS", "NEFT", "RTGS", "UPI"].map((mode) => (
                            <SelectItem key={mode} value={mode}>{mode}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="paymentRemark"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">Payment Remark</FormLabel>
                      <FormControl>
                        <Input className="h-9" placeholder="Enter Remark" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button variant="secondary" onClick={handleModalClose} className="flex-1 sm:flex-none">
                Close
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
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