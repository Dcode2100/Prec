import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckIcon, XIcon, ClockIcon, CopyIcon } from 'lucide-react'
import moment from 'moment'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { capitalize, getNumberInRupee } from '@/utils/utils'
import {
  getAccount,
  getWalletTransactionsById,
} from '@/lib/api/transactionsApi'

interface WalletTransactionDetailsProps {
  isOpen: boolean
  onClose: () => void
  transaction_id: string
}

const WalletTransactionDetails = ({
  isOpen,
  onClose,
  transaction_id,
}: WalletTransactionDetailsProps): React.ReactElement => {
  const { toast } = useToast()

  const { data: transactionData, isLoading: isTransactionLoading } = useQuery({
    queryKey: ['transaction_details', transaction_id],
    queryFn: () => getWalletTransactionsById(transaction_id),
  })

  const transaction = transactionData?.transactions

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ['account_details', transaction?.account_id],
    queryFn: () => getAccount('PE', transaction?.account_id),
    enabled: !!transaction?.account_id,
  })

  const status = transaction?.status || ''
  const statusInfo = {
    color:
      status.toLowerCase() === 'success' || status.toLowerCase() === 'completed'
        ? 'text-green-500'
        : status.toLowerCase() === 'rejected' ||
          status.toLowerCase() === 'faliure'
        ? 'text-red-500'
        : 'text-yellow-500',
    icon:
      status.toLowerCase() === 'success' || status.toLowerCase() === 'completed'
        ? CheckIcon
        : status.toLowerCase() === 'rejected' ||
          status.toLowerCase() === 'faliure'
        ? XIcon
        : ClockIcon,
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      description: 'Value copied to clipboard',
      duration: 1500,
    })
  }

  const DetailRow = ({ label, value, copyable = false }) => (
    <div className="py-1 flex justify-between items-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center">
        <span className="text-base font-semibold text-right">
          {value || '-'}
        </span>
        {copyable && (
          <CopyIcon
            className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(value)}
          />
        )}
      </div>
    </div>
  )

  const handleAccountDetail = () => {
    // router.push(`/accounts/PE/${account?.account_id}`);
  }

  const getSheetContent = () => {
    if (isTransactionLoading || isAccountLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      )
    }

    return (
      <div className="mt-6 space-y-6">
        <div className="space-y-1">
          <DetailRow
            label="Transaction ID"
            value={transaction?.wallet_transaction_id}
            copyable
          />
          <DetailRow
            label="Vendor Transaction ID"
            value={transaction?.vendor_wallet_transaction_id}
            copyable
          />
          <DetailRow
            label="Vendor Wallet Id"
            value={transaction?.vendor_wallet_id}
            copyable
          />
          <DetailRow
            label="Vendor Transaction Id"
            value={transaction?.vendor_transaction_id}
            copyable
          />
          <DetailRow
            label="Account Id"
            value={transaction?.account_id}
            copyable
          />
          <DetailRow
            label="Account Name"
            value={
              <Button
                size="sm"
                onClick={() => handleAccountDetail(accountData)}
                className="font-semibold"
              >
                {capitalize(accountData?.contact?.name)}
              </Button>
            }
          />
          <DetailRow
            label="Wallet Id"
            value={transaction?.wallet_id}
            copyable
          />
          <DetailRow
            label="Gui Wallet Transaction Id"
            value={transaction?.gui_wallet_transaction_id}
            copyable
          />
          {transaction?.order_id && (
            <DetailRow
              label="Order ID"
              value={transaction?.order_id}
              copyable
            />
          )}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow
            label="Amount"
            value={getNumberInRupee(transaction?.amount, true)}
          />
          <DetailRow
            label="Closing Balance"
            value={getNumberInRupee(transaction?.account_balance, true)}
          />
          <DetailRow
            label="Transaction Type"
            value={transaction?.user_transaction_type}
          />
          <DetailRow label="Direction" value={transaction?.credit_debit} />
          <DetailRow
            label="Status"
            value={
              <Badge variant="outline" className={`${statusInfo.color} ml-2`}>
                {transaction?.status}
              </Badge>
            }
          />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          {accountData?.bank_details?.[0] && (
            <>
              <DetailRow
                label="User Bank Account Number"
                value={accountData.bank_details[0].account_number}
                copyable
              />
              <DetailRow
                label="User Bank Name"
                value={accountData.bank_details[0].bank_name}
              />
              <DetailRow
                label="User Bank IFSC"
                value={accountData.bank_details[0].ifsc}
                copyable
              />
            </>
          )}
          <DetailRow
            label="Sender Account Number"
            value={transaction?.sender_account_number}
            copyable
          />
          <DetailRow
            label="Sender Account IFSC"
            value={transaction?.sender_account_ifsc}
            copyable
          />
          <DetailRow
            label="User Transaction Type"
            value={transaction?.user_transaction_typ}
          />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow
            label="Created At"
            value={moment(transaction?.created_at).format('MM.DD.YYYY hh:mm a')}
          />
          <DetailRow
            label="Updated At"
            value={moment(transaction?.updated_at).format('MM.DD.YYYY hh:mm a')}
          />
        </div>
      </div>
    )
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Wallet Transaction Details</SheetTitle>
        </SheetHeader>
        {getSheetContent()}
      </SheetContent>
    </Sheet>
  )
}

export default WalletTransactionDetails
