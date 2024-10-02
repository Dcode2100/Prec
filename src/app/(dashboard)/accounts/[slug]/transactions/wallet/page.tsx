'use client'
import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { FilterDrawer } from '@/components/accountTable/FilterDrawer'
import { FilterSelect } from '@/components/accountTable/FilterSelect'
import { FilterDateSelect } from '@/components/accountTable/FilterDateSelect'
import { FilterRadioButtons } from '@/components/accountTable/FilterRadioButtons'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import {
  getAccountWalletTransactions,
  createWallet,
  initializeWalletTransfer,
  approvePendingTransactions,
} from '@/lib/api/transactionsApi'
import {
  WalletTransactionsParams,
  InitializeWalletTransferParams,
  TransactionStatus,
  WalletTransactionListObj,
} from '@/lib/types/types'
import { capitalize, getNumberInRupee } from '@/lib/globals/utils'
import dynamic from 'next/dynamic'

const AccountWalletTransactionDetails = dynamic(
  () => import('@/components/sheets/AccountWalletTransactionDetails'),
  { ssr: false }
)

const statusOptions = [
  'All',
  TransactionStatus.COMPLETED,
  TransactionStatus.PENDING,
  TransactionStatus.REJECTED,
  TransactionStatus.CANCELLED,
  TransactionStatus.REFUND_PENDING,
  TransactionStatus.REFUND_FAILED,
  TransactionStatus.REFUND_COMPLETED,
]
const dateFilter = [
  { value: 'createdAt', label: 'Created At', id: '0' },
  { value: 'updatedAt', label: 'Updated At', id: '1' },
  { value: 'transactionTime', label: 'Transaction Time', id: '2' },
]

const WalletTable = (): React.ReactElement => {
  const { toast } = useToast()
  const router = useRouter()
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const [applyFilter, setApplyFilter] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [amountFilter, setAmountFilter] = useState<any>([null, null])
  const [selectedDates, setSelectedDates] = useState<any>([null, null])
  const [dateFilterType, setDateFilterType] = useState('createdAt')
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false)
  const [selectedTransactionId, setSelectedTransactionId] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchOrders = async () => {
    const params: WalletTransactionsParams = {
      page,
      limit,
    }
    if (applyFilter) {
      if (statusFilter && statusFilter !== 'All') {
        params.status = statusFilter
      }
    }
    params.amountAbove = amountFilter[0] ?? undefined
    params.amountBelow = amountFilter[1] ?? undefined
    if (selectedDates[0] && selectedDates[1]) {
      params.dateFilterBy = dateFilterType
      params[
        dateFilterType === 'updatedAt'
          ? 'updatedAfter'
          : dateFilterType === 'transactionTime'
          ? 'transactionAfter'
          : 'createdAfter'
      ] = selectedDates[0].utc().toISOString()
      params[
        dateFilterType === 'updatedAt'
          ? 'updatedBefore'
          : dateFilterType === 'transactionTime'
          ? 'transactionBefore'
          : 'createdBefore'
      ] = selectedDates[1].utc().toISOString()
    }
    return getAccountWalletTransactions(accountId, accountType, params)
  }

  const accountWalletQuery = useQuery({
    queryKey: ['wallet', accountId, page, limit, applyFilter, selectedDates],
    queryFn: fetchOrders,
    refetchInterval: 0,
  })

  const handleCreateWallet = async (account: any) => {
    try {
      const response = await createWallet(account.account_id)
      // getAccountRefetch();
      if (response.statusCode === 201) {
        toast({
          description: response.message,
          variant: 'default',
        })
      }
    } catch (err) {
      toast({
        description: 'Failed to create wallet',
        variant: 'destructive',
      })
    }
  }

  const initializeWalletTransferfn = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    const params: InitializeWalletTransferParams = {
      status,
      walletTransactionId,
    }
    try {
      const response = await initializeWalletTransfer(accountId, params)
      toast({
        description: response?.message,
        variant: 'default',
      })
    } catch (err) {
      toast({
        description: 'Failed to initialize wallet transfer',
        variant: 'destructive',
      })
    } finally {
      accountWalletQuery.refetch()
    }
  }

  const updatePendingTransactions = async (
    status: string,
    walletTransactionId: string
  ) => {
    try {
      await approvePendingTransactions(status, walletTransactionId)
    } catch (err) {
      toast({
        description: 'Failed to update pending transaction',
        variant: 'destructive',
      })
    } finally {
      accountWalletQuery.refetch()
    }
  }

  const columns = [
    {
      header: 'GUI Transaction Id',
      accessorKey: 'gui_wallet_transaction_id',
    },
    {
      header: 'Vendor Wallet Transaction Id',
      accessorKey: 'vendor_wallet_transaction_id',
    },
    {
      header: 'Vendor Wallet Id',
      accessorKey: 'vendor_wallet_id',
    },
    {
      header: 'UTR No',
      accessorKey: 'reference_number',
    },
    {
      header: 'Amount',
      accessorKey: 'transaction_amount',
      cell: (value: any) => getNumberInRupee(value, true),
    },
    {
      header: 'Fees',
      accessorKey: 'charges_gst',
      cell: (value: any) => getNumberInRupee(value, true),
    },
    {
      header: 'Settled Amt',
      accessorKey: 'settled_amount',
      cell: (value: any) => getNumberInRupee(value, true),
    },
    {
      header: 'Payment Type',
      accessorKey: 'payment_type',
    },
    {
      header: 'User Transaction Type',
      accessorKey: 'user_transaction_type',
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value: any) => capitalize(value?.split('_').join(' ') || ''),
    },
    {
      header: 'Type',
      accessorKey: 'credit_debit',
    },
    {
      header: 'Trade Time',
      accessorKey: 'created_at',
      cell: (value: any) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  const exportData = useMemo(
    () =>
      accountWalletQuery.data?.PE?.map((row: any) => ({
        ...row,
        created_at: moment(row?.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(row?.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        transaction_time: row.transaction_time
          ? moment(row?.transaction_time).format('YYYY-MM-DD HH:mm:ss')
          : '',
      })) || [],
    [accountWalletQuery.data?.PE]
  )

  const exportHeaders = [
    { label: 'Transaction ID', key: 'gui_wallet_transaction_id' },
    { label: 'Account ID', key: 'account_id' },
    { label: 'Direction', key: 'credit_debit' },
    { label: 'UTR No', key: 'reference_number' },
    { label: 'Amount', key: 'transaction_amount' },
    { label: 'Transaction Fees', key: 'charges_gst' },
    { label: 'Order Value', key: 'order_value' },
    { label: 'Order Stamp Duty', key: 'stamp_duty' },
    { label: 'Order Transaction Fees', key: 'transaction_fees' },
    { label: 'Documentation Charges', key: 'documentation_charges' },
    { label: 'Closing Balance', key: 'account_balance' },
    { label: 'User Transaction Type', key: 'user_transaction_type' },
    { label: 'Precize Transaction Type', key: 'precize_transaction_type' },
    { label: 'Status', key: 'status' },
    { label: 'Transaction Time', key: 'transaction_time' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
    { label: 'Vendor Transaction ID', key: 'vendor_transaction_id' },
    { label: 'Email', key: 'wallet.user.email' },
    { label: 'Mobile', key: 'wallet.user.mobile' },
    { label: 'Transaction Type', key: 'transaction_type' },
    { label: 'Gui Wallet Transaction Id', key: 'gui_wallet_transaction_id' },
    { label: 'Order Id', key: 'order_id' },
    { label: 'Provider Name', key: 'provider_name' },
    { label: 'Vendor Name', key: 'vendor_name' },
    { label: 'Vendor Wallet Id', key: 'vendor_wallet_id' },
    { label: 'Vendor status', key: 'vendor_status' },
    { label: 'Wallet Id', key: 'wallet_id' },
    { label: 'Wallet Transaction Id', key: 'wallet_transaction_id' },
    { label: 'Withdraw Amount', key: 'withdraw_amount' },
    {
      label: 'Vendor Wallet Transaction ID',
      key: 'vendor_wallet_transaction_id',
    },
    {
      label: 'Bank Account No',
      key: 'wallet.user.bank_details[0].account_number',
    },
    { label: 'Account IFSC', key: 'wallet.user.bank_details[0].account_ifsc' },
    { label: 'Bank Name', key: 'wallet.user.bank_details[0].bank_name' },
    { label: 'Branch Name', key: 'wallet.user.bank_details[0].branch_name' },
  ]

  const handleOpenTransactionDetails = (transactionId: string) => {
    setSelectedTransactionId(transactionId)
    setIsTransactionDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CSVLink
          data={exportData}
          filename={`wallet_transactions_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={exportHeaders}
        >
          <Button>Export</Button>
        </CSVLink>
        <Button onClick={() => setFilterOpen(true)}>Filter</Button>
      </div>

      <AccountTable
        columns={columns}
        data={accountWalletQuery.data?.PE || []}
        totalItems={accountWalletQuery.data?.total || 0}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(newPage, newLimit) => {
          setPage(newPage)
          if (newLimit) setLimit(newLimit)
        }}
        isLoading={accountWalletQuery.isLoading}
        onRowClick={(row) => {
          handleOpenTransactionDetails(row.wallet_transaction_id as string)
        }}
      />

      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        onApply={() => {
          setApplyFilter(true)
          setFilterOpen(false)
        }}
      >
        <FilterSelect
          header="Status"
          options={statusOptions}
          onSelect={setStatusFilter}
          selected={statusFilter}
        />
        <FilterRadioButtons
          list={dateFilter}
          onSelect={(e) => {
            setDateFilterType(e)
          }}
          value={dateFilterType}
          setValue={setDateFilterType}
        />
        <FilterDateSelect
          header=""
          onDateSelect={(st, ed) => setSelectedDates([st, ed])}
        />
      </FilterDrawer>

      <AccountWalletTransactionDetails
        isOpen={isTransactionDetailsOpen}
        onClose={() => setIsTransactionDetailsOpen(false)}
        transaction_id={selectedTransactionId}
        setLoading={setLoading}
      />
    </div>
  )
}

export default WalletTable
