'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AccountTable } from '@/components/AccountTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import FilterButton from '@/components/accountTable/FilterButton'
import { FilterDrawer } from '@/components/accountTable/FilterDrawer'
import { FilterSelect } from '@/components/accountTable/FilterSelect'
import { FilterDateSelect } from '@/components/accountTable/FilterDateSelect'
import { FilterRadioButtons } from '@/components/accountTable/FilterRadioButtons'
import {
  getWalletTransactions,
  getWalletTransactionsByAccountId,
} from '@/lib/api/transactionsApi'
import {
  WalletTransactionListObj,
  TransactionsParams,
  TransactionStatus,
} from '@/lib/types/types'
import { capitalize, getNumberInRupee } from '@/utils/utils'
import UploadCSV from '@/components/UploadDocument/UploadBulkCreditWalletTransaction'
import WalletTransactionDetails from '@/components/sheets/WalletTransactionDetails'
import ApproveProcessPendingDepositsModal from '@/components/modals/ApproveProcessPendingDepositsModal'
import { approveDeposits } from '@/lib/api/fundApi'
import { useToast } from '@/hooks/use-toast'

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

function CreditWalletTransactions() {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')
  const { toast } = useToast()

  const [selectedTab, setSelectedTab] = useState('all')
  const [filterOpen, setFilterOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [selectedDates, setSelectedDates] = useState<[Date | null, Date | null]>([null, null])
  const [dateFilterType, setDateFilterType] = useState('createdAt')
  const [applyFilter, setApplyFilter] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')

  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(
    null
  )
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false)

  const [isLoadingAction, setIsLoadingAction] = useState({
    btnId: '',
    walletTransactionId: '',
    accountId: '',
    isApproveModalOpen: false,
    btnIdx: 0,
    utrNumber: '',
    amount: '',
    transactionTime: '',
    paymentRemark: '',
  })

  const fetchTransactions = async () => {
    const params: TransactionsParams = {
      page,
      limit,
      direction: 'CREDIT',
      status:
        selectedTab === 'processPending' ? 'process_pending' : statusFilter,
      search: search || undefined,
    }

    if (applyFilter) {
      if (selectedDates[0] && selectedDates[1]) {
        params.dateFilterBy = dateFilterType
        params[
          dateFilterType === 'updatedAt' ? 'updatedAfter' : 'createdAfter'
        ] = selectedDates[0].toISOString()
        params[
          dateFilterType === 'updatedAt' ? 'updatedBefore' : 'createdBefore'
        ] = selectedDates[1].toISOString()
      }
    }

    return accountId
      ? await getWalletTransactionsByAccountId(accountId, params)
      : await getWalletTransactions(params)
  }

  const { data, isLoading, refetch } = useQuery({
    queryKey: [
      'creditTransactions',
      selectedTab,
      page,
      limit,
      statusFilter,
      applyFilter,
      search,
    ],
    queryFn: fetchTransactions,
    // keepPreviousData: true
  })

  const transactions = data?.PE || []

  const columns = [
    {
      header: 'Transaction ID',
      accessorKey: 'gui_wallet_transaction_id',
      sortable: true,
    },
    {
      header: 'Account ID',
      cell: () => accountId,
    },
    {
      header: 'Direction',
      accessorKey: 'credit_debit',
      cell: (value) => capitalize(value),
      sortable: true,
    },
    { header: 'UTR No', accessorKey: 'reference_number', sortable: true },
    {
      header: 'Amount',
      accessorKey: 'charges_gst',
      cell: (value) => getNumberInRupee(value, true),
      sortable: true,
    },
    {
      header: 'Fees',
      accessorKey: 'settled_amount',
      cell: (value) => getNumberInRupee(value, true),
      sortable: true,
    },
    {
      header: 'Settled Amt',
      accessorKey: 'transaction_amount',
      cell: (value) => getNumberInRupee(value, true),
      sortable: true,
    },
    {
      header: 'Closing Balance',
      accessorKey: 'account_balance',
      cell: (value) => getNumberInRupee(value, true),
      sortable: true,
    },
    {
      header: 'Transaction Type',
      accessorKey: 'user_transaction_type',
      sortable: true,
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value) => capitalize(value?.split('_').join(' ')),
      sortable: true,
    },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: (value) => moment(value).format('DD-MM-YYYY HH:mm:ss'),
      sortable: true,
    },
  ]

  const processPendingColumns = [
    ...columns,
    {
      header: 'Action',
      accessorKey: 'action',
      cell: (row ) => (
        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const transaction = transactions[row.index];
              setIsLoadingAction({
                btnId: transaction.wallet_transaction_id,
                walletTransactionId: transaction.wallet_transaction_id,
                accountId: transaction.account_id,
                isApproveModalOpen: true,
                btnIdx: 1,
                utrNumber: transaction.reference_number || '',
                amount: transaction.transaction_amount || '',
                transactionTime: transaction.created_at || '',
                paymentRemark: '',
              })
            }}
          >
            Approve
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const transaction = transactions[row.index];
              rejectTransaction(
                transaction.account_id,
                'REJECT',
                transaction.wallet_transaction_id
              )
            }}
          >
            Decline
          </Button>
        </div>
      ),
    },
  ]

  const filterPills = {
    status: capitalize(statusFilter),
    dates:
      selectedDates[0] && selectedDates[1]
        ? `${moment(selectedDates[0]).format('DD/MM/YYYY')} - ${moment(
            selectedDates[1]
          ).format('DD/MM/YYYY')}`
        : null,
  }

  const removeFilter = (filterId: string) => {
    if (filterId === 'status') {
      setStatusFilter('All')
    }
    if (filterId === 'dates') {
      setSelectedDates([null, null])
      setDateFilterType('createdAt')
    }
    setApplyFilter(false)
  }

  const rejectTransaction = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    try {
      const response = await approveDeposits(
        { status, accountId },
        walletTransactionId
      )
      refetch()
      toast({
        description: response?.message,
        variant: 'default',
        duration: 3000,
      })
    } catch (err) {
      toast({
        description: 'Failed to reject transaction',
        variant: 'destructive',
        duration: 3000,
      })
    }
  }

  return (
    <>
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
          onSelect={(e) => setDateFilterType(e)}
          value={dateFilterType}
          setValue={setDateFilterType}
        />
        <FilterDateSelect
          header=""
          onDateSelect={(st, ed) => setSelectedDates([st, ed])}
        />
      </FilterDrawer>

      <Tabs defaultValue="all" onValueChange={(value) => setSelectedTab(value)}>
        <div className="flex justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="processPending">
              Process Pending Deposits
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-4">
            {selectedTab === 'all' && <UploadCSV buttonText="Upload" />}
            <Button>
              <CSVLink
                data={transactions}
                filename={`TransactionData_${moment(new Date()).format(
                  'MMMM Do YYYY, h:mm:ss a'
                )}.csv`}
                headers={headers}
              >
                Export
              </CSVLink>
            </Button>
            <FilterButton
              filterPills={applyFilter ? filterPills : {}}
              openFilter={() => setFilterOpen(true)}
              removeFilter={removeFilter}
            />
          </div>
        </div>

        <TabsContent value="all">
          <AccountTable
            columns={columns}
            data={transactions}
            totalItems={data?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            onSearch={(value) => setSearch(value)}
            isSearchable
            isLoading={isLoading}
            onRowClick={(row) => {
              setSelectedTransaction(row.wallet_transaction_id as string)
              setIsTransactionDetailsOpen(true)
            }}
          />
          {selectedTransaction && (
            <WalletTransactionDetails
              isOpen={isTransactionDetailsOpen}
              onClose={() => setIsTransactionDetailsOpen(false)}
              transaction_id={selectedTransaction}
            />
          )}
        </TabsContent>
        <TabsContent value="processPending">
          <AccountTable
            columns={processPendingColumns}
            data={transactions}
            totalItems={data?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            onSearch={(value) => setSearch(value)}
            isSearchable
            isLoading={isLoading}
            onRowClick={(row) => {
              setSelectedTransaction(row.wallet_transaction_id as string)
              setIsTransactionDetailsOpen(true)
            }}
          />
          <ApproveProcessPendingDepositsModal
            isLoadingAction={isLoadingAction}
            setIsLoadingAction={setIsLoadingAction}
            refetch={refetch}
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default CreditWalletTransactions