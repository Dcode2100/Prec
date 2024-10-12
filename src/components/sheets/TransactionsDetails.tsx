'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { CheckIcon, XIcon, ClockIcon } from 'lucide-react'
import moment from 'moment'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'

import { CopyButton } from '@/components/CopyButton'
import { capitalize, getNumberInRupee } from '@/utils/utils'
import {
  getTransactionById,
  getAccount,
  updateTransactionStatusById,
  refundData,
} from '@/lib/api/transactionsApi'
import router from 'next/router'
import { getGlobalItem } from '../../utils/utils'
import React from 'react'

interface TransactionDetailsProps {
  isOpen: boolean
  onClose: () => void
  transaction_id: string
  type?: object
  setLoading: (value: boolean) => void
}

const DetailRow = (props: { label: string; children: React.ReactElement }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium opacity-60">{props.label}</span>
    {props.children}
  </div>
)

const handleAccountDetail = (accounts: any) => {
  router.push(
    `/accounts/${
      accounts?.type === 'Broking'
        ? 'BK'
        : accounts?.type === 'PE'
        ? 'PE'
        : 'MF'
    }/${accounts?.account_id}`
  )
}

const TransactionDetails = (
  props: TransactionDetailsProps
): React.ReactElement => {
  const [updateSelectedStatus, setUpdateSelectedStatus] = useState('completed')
  const transaction_id = props.transaction_id
  const [accountId, setAccountId] = useState('')
  const { toast } = useToast()
  const isAffiliate = getGlobalItem('isAffiliate')

  const fetchTransactionDetails = () => {
    return getTransactionById(transaction_id, props.type)
  }

  const transactionDetailsQuery = useQuery({
    queryKey: ['transaction_details', transaction_id],
    queryFn: fetchTransactionDetails,
  })

  const transaction = transactionDetailsQuery.data?.transactions
  const peType = transactionDetailsQuery.data?.type

  const fetchAccountrDetails = async () => {
    return await getAccount(peType === 'PE' ? 'PE' : '', transaction?.user_id)
  }

  const accountDetailsQuery = useQuery({
    queryKey: ['account_details', transaction?.user_id],
    queryFn: fetchAccountrDetails,
  })

  const accounts = accountDetailsQuery.data

  const status = transaction?.status || ''

  let statusColor = ''
  let statusIcon
  if (['Success', 'completed'].includes(status)) {
    statusColor = 'success'
    statusIcon = <CheckIcon className="h-4 w-4 mr-1" />
  } else if (['rejected'].includes(status)) {
    statusColor = 'error'
    statusIcon = <XIcon className="h-4 w-4 mr-1" />
  } else if (['FALIURE'].includes(status)) {
    statusColor = 'error'
    statusIcon = <XIcon className="h-4 w-4 mr-1" />
  } else {
    statusColor = 'warning'
    statusIcon = <ClockIcon className="h-4 w-4 mr-1" />
  }

  const copyDetail = (label: string, value: string | undefined) => (
    <DetailRow label={label}>
      <CopyButton isTruncated iconSide="left" value={value || ''} />
    </DetailRow>
  )
  const orderDetail = (label: string, value: string | any) => (
    <DetailRow label={label} key={label}>
      <span className="font-medium">{value || '-'}</span>
    </DetailRow>
  )
  const moneyDetail = (label: string, value: number | undefined) => (
    <DetailRow label={`${label}`}>
      <span className="font-medium">
        {value ? getNumberInRupee(value, true) : '-'}
      </span>
    </DetailRow>
  )
  const statusDetail = (label: string, value: string | undefined) => (
    <DetailRow label={`${label}`}>
      <span
        className={`font-medium ${
          transaction?.status.toLowerCase() === 'completed'
            ? 'text-green-500'
            : transaction?.status.toLowerCase() === 'rejected'
            ? 'text-red-500'
            : 'text-yellow-500'
        }`}
      >
        {value}
      </span>
    </DetailRow>
  )

  const dateDetail = (label: string, date: moment.Moment | undefined) => (
    <DetailRow label={label}>
      <div className="flex items-center">
        <span className="text-sm font-medium opacity-60 mr-1">
          {!date ? '' : date.format('hh:mm a')}
        </span>
        <span className="font-medium">
          {!date ? '-' : date.format('MM.DD.YYYY')}
        </span>
      </div>
    </DetailRow>
  )
  const transactionDetail = (label: string, value: string | undefined) => (
    <DetailRow label={label}>
      <span className="font-medium">{value || '-'}</span>
    </DetailRow>
  )
  const directionDetails = (
    <DetailRow label="Side">
      <span
        className={`font-medium ${
          transaction?.direction.toLowerCase() === 'deposit'
            ? 'text-green-500'
            : 'text-red-500'
        }`}
      >
        {capitalize(transaction?.direction)}
      </span>
    </DetailRow>
  )

  const getSheetContent = () => {
    if (transactionDetailsQuery.isLoading) {
      return (
        <div className="space-y-4 mt-8 mx-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      )
    }

    const PeTransactionStatus: Record<string, string> = {
      PENDING: 'Pending',
      SUCCESS: 'Completed',
      FAILED: 'Rejected',
      CANCELLED: 'Cancelled',
      REFUND_PENDING: 'Refund Pending',
      REFUND_FAILED: 'Refund Failed',
      REFUND_SUCCESS: 'Refund Completed',
    }

    const updateStatus = async () => {
      const response = await updateTransactionStatusById(
        'PE',
        transaction?.transaction_id,
        updateSelectedStatus == 'completed' ? 'SUCCESS' : updateSelectedStatus
      )
      if (response.status) {
        toast({
          description: 'Transaction Status Updated Successfully',
          variant: 'success',
        })
        props.setLoading(true)
        props.onClose()
      } else {
        props.setLoading(true)
        props.onClose()
      }
    }

    const refundStatus = async (accountId: string) => {
      try {
        const Response = await refundData(accountId)
        if (Response.status === 'REFUND_PENDING') {
          toast({
            description: 'Refund Successfull',
            variant: 'success',
          })
          props.setLoading(true)
        }
      } catch (err) {
        props.setLoading(true)
      }
    }

    const handleRefund = (account: { transactionId: string }) => {
      setAccountId(account.transactionId)
    }

    const handleConfirmation = (accountId: string) => {
      refundStatus(accountId)
      setAccountId('')
    }

    return (
      <>
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            View and manage transaction information.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-4">
            {copyDetail('Transaction ID', transaction?.gui_transaction_id)}
            {copyDetail(
              'Vender Transaction ID',
              transaction?.vendor_transaction_id
            )}
            {copyDetail('Order ID', transaction?.gui_order_id)}
            {copyDetail('Account ID', accounts?.gui_account_id)}
            {orderDetail(
              'Account Name',
              <Button
                variant="link"
                size="sm"
                onClick={() => handleAccountDetail(accounts)}
              >
                {capitalize(accounts?.contact?.name)}
              </Button>
            )}
            {copyDetail('Account Email', accounts?.contact?.email)}
            {copyDetail('Company Name', transaction?.asset_name)}
          </div>

          <Separator />

          <div className="space-y-4">
            {moneyDetail('Amount', transaction?.amount)}
            {transactionDetail('UPI ID', transaction?.upi)}
            {directionDetails}

            {!isAffiliate && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  onValueChange={(value) => setUpdateSelectedStatus(value)}
                  defaultValue={status}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(PeTransactionStatus).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value as React.ReactNode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {isAffiliate &&
              statusDetail('Status', capitalize(transaction?.status))}

            <div className={`flex justify-between ${isAffiliate ? 'hidden' : ''}`}>
              {['completed', 'refund_failed', 'refund_pending'].includes(
                transaction?.status || ''
              ) && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleRefund(transaction)}>
                      Refund
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirmation</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to refund this transaction?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={props.onClose}>
                        Cancel
                      </Button>
                      <Button onClick={() => handleConfirmation(accountId)}>
                        Confirm
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button variant="default" onClick={updateStatus}>
                Update Status
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {dateDetail('Created At', moment(transaction?.createdAt))}
            {dateDetail('Updated At', moment(transaction?.updatedAt))}
          </div>
        </div>
      </>
    )
  }

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetClose asChild>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-4"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </SheetClose>
        {getSheetContent()}
      </SheetContent>
    </Sheet>
  )
}

export default TransactionDetails