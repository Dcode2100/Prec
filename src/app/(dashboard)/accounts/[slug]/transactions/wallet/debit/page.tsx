'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import AccountTable from '@/components/accountTable/AccountTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { SearchIcon } from 'lucide-react'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import WalletTransactionDetails from '@/components/sheets/WalletTransactionDetails'
import BankWithdrawExportSheet from '@/components/IDFC/BankWithdrawExportSheet'
import {
  getWalletTransactions,
  getWalletTransactionsByAccountId,
  initializeWalletTransfer,
} from '@/lib/api/transactionsApi'
import {
  WalletTransactionListObj,
  TransactionsParams,
  TransactionStatus,
  InitializeWalletTransferParams,
  WalletTransactionDirection,
} from '@/lib/types/types'
import { capitalize, getNumberInRupee } from '@/utils/utils'

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
]

const headers = [
  { label: 'Transaction ID', key: 'gui_wallet_transaction_id' },
  { label: 'Account ID', key: 'account_id' },
  { label: 'Direction', key: 'credit_debit' },
  { label: 'UTR No', key: 'reference_number' },
  { label: 'Amount', key: 'transaction_amount' },
  { label: 'Transaction Fees', key: 'charges_gst' },
  { label: 'Order Value', key: 'order_value' },
  { label: 'Order Stamp Duty', key: 'stamp_duty' },
  { label: 'Order Transaction Fees', key: 'transaction_fee' },
  { label: 'Gst', key: 'gst' },
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
  {
    label: 'Account IFSC',
    key: 'wallet.user.bank_details[0].account_ifsc',
  },
  {
    label: 'Bank Name',
    key: 'wallet.user.bank_details[0].bank_name',
  },
  {
    label: 'Branch Name',
    key: 'wallet.user.bank_details[0].branch_name',
  },
]

function DebitWalletTransactions() {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  // const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const [selectedDebitTab, setSelectedDebitTab] = useState(0)
  const { toast } = useToast()
  const [directionFilter, setDirectionFilter] = useState<string>('DEBIT')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined)
  const [search, setSearch] = useState('')
  const [dateFilterType, setDateFilterType] = useState('createdAt')

  const fetchDebitTransactions = async () => {
    const params: TransactionsParams = {
      page,
      limit,
      direction: directionFilter,
      status: selectedDebitTab === 3 ? 'process_pending' : statusFilter,
      search: search || undefined,
      dateFilterBy: dateFilterType,
    }

    if (accountId) {
      return getWalletTransactionsByAccountId(accountId, params)
    }
    return getWalletTransactions(params)
  }

  const debitTransactionsQuery = useQuery({
    queryKey: [
      'debitWalletTransactions',
      {
        page,
        limit,
        selectedDebitTab,
        directionFilter,
        statusFilter,
        search,
        dateFilterType,
        accountId,
      },
    ],
    queryFn: fetchDebitTransactions,
    // keepPreviousData: true,
    staleTime: 5000,
  })

  const transactions = debitTransactionsQuery.data?.PE || []

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
      debitTransactionsQuery.refetch()
    } catch (err) {
      toast({
        description: 'An error occurred',
        variant: 'destructive',
      })
    }
  }

  const columns = [
    {
      header: 'Transaction ID',
      accessorKey: 'gui_wallet_transaction_id',
      cell: (value: any) => value,
    },
    {
      header: 'Account ID',
      accessorKey: 'wallet.user.gui_account_id',
      cell: (value: any) => value,
    },
    {
      header: 'Direction',
      accessorKey: 'credit_debit',
      cell: (value: any) => capitalize(value),
    },
    { header: 'UTR No', accessorKey: 'reference_number' },
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
      header: 'Closing Balance',
      accessorKey: 'account_balance',
      cell: (value: any) => getNumberInRupee(value, true),
    },
    { header: 'Transaction Type', accessorKey: 'user_transaction_type' },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value: any) => capitalize(value?.split('_').join(' ')),
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: (value: any) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  if (selectedDebitTab === 3) {
    columns.push({
      header: 'Action',
      accessorKey: 'action',
      cell: (_, row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              initializeWalletTransferfn(
                row.account_id,
                'APPROVE',
                row.wallet_transaction_id
              )
            }
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              initializeWalletTransferfn(
                row.account_id,
                'REJECT',
                row.wallet_transaction_id
              )
            }
          >
            Reject
          </Button>
        </div>
      ),
    })
  }

  const handleTabChange = (value: string) => {
    const idx = parseInt(value)
    setSelectedDebitTab(idx)
    if (idx === 1) {
      setDirectionFilter(WalletTransactionDirection.ORDER)
    } else if (idx === 2) {
      setDirectionFilter(WalletTransactionDirection.WITHDRAW)
    } else {
      setDirectionFilter(WalletTransactionDirection.DEBIT)
    }
    setPage(1)
  }

  const exportData = React.useMemo(() => {
    return transactions?.map((row: any) => ({
      ...row,
      created_at: moment(row?.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(row?.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      transaction_time: row.transaction_time
        ? moment(row?.transaction_time).format('YYYY-MM-DD HH:mm:ss')
        : '',
    }))
  }, [transactions])

  const bankWithdrawExportData = React.useMemo(() => {
    const determinePaymentMethod = (
      transaction: WalletTransactionListObj
    ): string => {
      if (transaction.bene_account_ifsc?.includes('UTIB')) {
        return 'I'
      }
      const amount = parseFloat(transaction?.settled_amount)
      return amount <= 200000 ? 'N' : 'R'
    }

    let exportData = transactions?.map((row: WalletTransactionListObj) => ({
      'Payment Method Name': determinePaymentMethod(row),
      'Payment Amount (Request)': row?.settled_amount,
      'Activation Date': moment(new Date()).format('DD/MM/YYYY'),
      'Beneficiary Name (Request)':
        row?.wallet?.user?.first_name + ' ' + row?.wallet?.user?.last_name,
      'Account No': row?.bene_account_number,
      'Email Body': '',
      'Debit Account No': row?.debit_account_number,
      'CRN No': `PRE${row?.gui_wallet_transaction_id}`,
      'RECEIVER IFSC Code': row?.bene_account_ifsc,
      'RECEIVER Account Type': '11',
    }))
    return [
      {
        'Payment Method Name': 'Text',
        'Payment Amount (Request)': 'Amount',
        'Activation Date': 'Date',
        'Beneficiary Name (Request)': 'Text',
        'Account No': 'Text',
        'Email Body': 'Text',
        'Debit Account No': 'Numeric',
        'CRN No': 'Text',
        'RECEIVER IFSC Code': 'AlphaNumeric',
        'RECEIVER Account Type': 'Numeric',
      },
      ...exportData,
    ]
  }, [transactions])

  return (
    <>
      {selectedTransaction && (
        <WalletTransactionDetails
          isOpen={!!selectedTransaction}
          onClose={() => setSelectedTransaction(undefined)}
          transaction_id={selectedTransaction}
     
        />
      )}
      <div className="space-y-4 ">
        <Tabs
          value={selectedDebitTab.toString()}
          onValueChange={handleTabChange}
        >
          <TabsList className='mb-4'>
            <TabsTrigger value="0">All</TabsTrigger>
            <TabsTrigger value="1">Order</TabsTrigger>
            <TabsTrigger value="2">Withdrawals</TabsTrigger>
            <TabsTrigger value="3">Process Pending Withdrawals</TabsTrigger>
          </TabsList>

          <div className="flex justify-between items-center">
            <div className="flex items-center relative space-x-2">
              <SearchIcon className="h-5 w-5 absolute left-5" />
              <Input
                placeholder="Search Transaction"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm pl-10"
              />
            </div>
            <div className="flex space-x-2">
              <Button asChild>
                <CSVLink
                  data={exportData as WalletTransactionListObj[]}
                  filename={`TransactionData_${moment(new Date()).format(
                    'MMMM Do YYYY, h:mm:ss a'
                  )}.csv`}
                  headers={headers}
                >
                  Export
                </CSVLink>
              </Button>
              {selectedDebitTab === 3 && (
                <div className="relative ">
                  <BankWithdrawExportSheet data={bankWithdrawExportData} />
                </div>
              )}
            </div>
          </div>

          <TabsContent value="0">
            <AccountTable
              columns={columns}
              data={transactions}
              totalItems={debitTransactionsQuery.data?.total || 0}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={(newPage, newLimit) => {
                setPage(newPage)
                if (newLimit) setLimit(newLimit)
              }}
              isLoading={debitTransactionsQuery.isLoading}
              onRowClick={(row: any) =>
                setSelectedTransaction(row.wallet_transaction_id)
              }
            />
          </TabsContent>
          <TabsContent value="1">
            <AccountTable
              columns={columns}
              data={transactions}
              totalItems={debitTransactionsQuery.data?.total || 0}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={(newPage, newLimit) => {
                setPage(newPage)
                if (newLimit) setLimit(newLimit)
              }}
              isLoading={debitTransactionsQuery.isLoading}
              onRowClick={(row: any) =>
                setSelectedTransaction(row.wallet_transaction_id)
              }
            />
          </TabsContent>
          <TabsContent value="2">
            <AccountTable
              columns={columns}
              data={transactions}
              totalItems={debitTransactionsQuery.data?.total || 0}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={(newPage, newLimit) => {
                setPage(newPage)
                if (newLimit) setLimit(newLimit)
              }}
              isLoading={debitTransactionsQuery.isLoading}
              onRowClick={(row: any) =>
                setSelectedTransaction(row.wallet_transaction_id)
              }
            />
          </TabsContent>
          <TabsContent value="3">
            <AccountTable
              columns={columns}
              data={transactions}
              totalItems={debitTransactionsQuery.data?.total || 0}
              itemsPerPage={limit}
              currentPage={page}
              onPageChange={(newPage, newLimit) => {
                setPage(newPage)
                if (newLimit) setLimit(newLimit)
              }}
              isLoading={debitTransactionsQuery.isLoading}
              onRowClick={(row: any) =>
                setSelectedTransaction(row.wallet_transaction_id)
              }
            />
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}

export default DebitWalletTransactions
