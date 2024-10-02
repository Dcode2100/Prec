import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import moment from 'moment'
import { approveDeposits } from '@/lib/api/fundApi'
import { ApproveDepositParams } from '@/lib/types/types'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'

interface loading {
  btnId: string
  walletTransactionId: string
  accountId: string
  isApproveModalOpen: boolean
  btnIdx: number
  utrNumber: string
  amount: string
  transactionTime: string
  paymentRemark: string
}

interface ApproveProcessPendingDepositsModalProps {
  isLoadingAction: loading
  setIsLoadingAction: Function
  refetch: Function
}

const ApproveProcessPendingDepositsModal = ({
  refetch,
  isLoadingAction,
  setIsLoadingAction,
}: ApproveProcessPendingDepositsModalProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const validationSchema = Yup.object().shape({
    remitterName: Yup.string().required('RemitterName is required'),
    remitterAccountNumber: Yup.string().required(
      'RemitterAccountNumber is required'
    ),
    depositAmount: Yup.number()
      .transform((value) => (isNaN(value) ? null : value))
      .nullable()
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
        return parsedDate.toString() !== 'Invalid Date' ? parsedDate : undefined
      })
      .required('Date is required'),
    remitterIfsc: Yup.string()
      .required('Remitter IFSC is required')
      .matches(/^[a-zA-Z0-9]+$/, 'UTR must be alphanumeric'),
  })

  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      utr: isLoadingAction?.utrNumber || '',
      depositAmount: isLoadingAction?.amount
        ? parseFloat(isLoadingAction?.amount)
        : 0,
      createdAt: isLoadingAction?.transactionTime
        ? moment
            .utc(isLoadingAction?.transactionTime)
            .utcOffset('+05:30')
            .toDate()
        : new Date(),
      paymentMode: '',
      remitterName: '',
      remitterAccountNumber: '',
      remitterIfsc: '',
      paymentRemark: '',
    },
  })

  const handleApproveDeposits = async (data: ApproveDepositParams) => {
    setIsLoading(true)
    try {
      const response = await approveDeposits(
        data,
        isLoadingAction.walletTransactionId ?? ''
      )
      if (response?.statusCode === 200) {
        refetch()
        toast({
          description: response.message,
          variant: 'default',
        })
      }
    } catch (err: any) {
      toast({
        description: 'An error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      handleModalClose()
    }
  }

  const handleModalClose = () => {
    form.reset()
    setIsLoadingAction({
      btnId: '',
      walletTransactionId: '',
      accountId: '',
      isApproveModalOpen: false,
      btnIdx: 0,
    })
  }

  const onSubmit = form.handleSubmit(async (data) => {
    const payload = {
      accountId: isLoadingAction?.accountId,
      status: 'APPROVE',
      utr: data?.utr?.toUpperCase(),
      amount: data?.depositAmount?.toString(),
      createdAt: data?.createdAt?.toISOString(),
      paymentMode: data?.paymentMode,
      remitterName: data?.remitterName,
      remitterAccountNumber: data?.remitterAccountNumber,
      remitterIfsc: data?.remitterIfsc?.toUpperCase(),
      paymentRemark: data?.paymentRemark,
    }
    handleApproveDeposits(payload as ApproveDepositParams)
  })

  useEffect(() => {
    if (isLoadingAction?.isApproveModalOpen) {
      form.reset({
        utr: isLoadingAction?.utrNumber || '',
        depositAmount: isLoadingAction?.amount
          ? parseFloat(isLoadingAction?.amount)
          : 0,
        createdAt: isLoadingAction?.transactionTime
          ? moment
              .utc(isLoadingAction?.transactionTime)
              .utcOffset('+05:30')
              .toDate()
          : new Date(),
      })
    }
  }, [isLoadingAction?.isApproveModalOpen])

  return (
    <Dialog
      open={isLoadingAction?.isApproveModalOpen}
      onOpenChange={handleModalClose}
    >
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Confirm Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="utr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UTR Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter UTR Number"
                        disabled={isLoadingAction?.utrNumber ? true : false}
                        className="uppercase"
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
                      <Input
                        {...field}
                        placeholder="Enter Deposit Amount"
                        disabled={isLoadingAction?.amount ? true : false}
                      />
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
                    <FormLabel>Transaction Time</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="datetime-local"
                        value={field.value.toISOString()}
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
                        {['IMPS', 'NEFT', 'RTGS'].map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
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
                      <Input {...field} placeholder="Enter Remitter Name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remitterAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remitter Account Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        placeholder="Enter Remitter Account Number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remitterIfsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remitter IFSC</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter Remitter IFSC"
                        className="uppercase"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentRemark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Remark</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter Remark" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Confirming...' : 'Confirm'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ApproveProcessPendingDepositsModal
