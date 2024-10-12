'use client'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { SearchIcon } from 'lucide-react'
import {
  approveDeposits,
  getWalletTransactions,
} from '@/lib/api/transactionsApi'
import {
  WalletTransactionListObj,
  TransactionsParams,
  TransactionStatus,
  ApproveDepositParams,
} from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import {
  AccountTable,
  FilterDrawer,
  FilterSelect,
  FilterButton,
  rangeToPill,
  dateRangeToPill,
  FilterDateSelect,
  FilterRadioButtons,
  FilterNumber,
} from '@/components/accountTable'
import { capitalize, getNumberInRupee } from '@/utils/utils'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import WalletTransactionDetails from '@/components/sheets/WalletTransactionDetails'
import ApproveProcessPendingDepositsModal from '../modals/ApproveProcessPendingDepositsModal'
import UploadCSV from '../UploadDocument/UploadBulkCreditWalletTransaction'

interface Transaction {
  created_at: string
  updated_at: string
}

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
  const [selectedCreditTab, setSelectedCreditTab] = useState('all')
  const { toast } = useToast()

  const [filterOpen, setFilterOpen] = useState(false)
  const [directionFilter, setDirectionFilter] = useState<string>('CREDIT')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [amountFilter, setAmountFilter] = useState<any>([null, null])
  const [selectedDates, setSelectedDates] = useState<any>([null, null])
  const [filterKey, setFilterKey] = useState<any>(['transactions'])
  const [applyFilter, setApplyFilter] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined)
  const [search, setSearch] = useState('')
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
  const [dateFilterType, setDateFilterType] = useState('createdAt')

  const inputRef = useRef<any>(null)
  const [userId, setUserId] = useState('')
  const [exportData, setExportData] = useState<Transaction[]>([])

  const fetchCreditTransactions = async () => {
    const params: TransactionsParams = applyFilter
      ? {
          page,
          limit,
          direction: directionFilter,
          status:
            selectedCreditTab === 'pending' ? 'process_pending' : statusFilter,
        }
      : {
          direction: directionFilter,
          page,
          limit,
          status:
            selectedCreditTab === 'pending' ? 'process_pending' : statusFilter,
        }

    if (applyFilter) {
      inputRef.current.value = ''
      if (directionFilter && directionFilter !== 'All') {
        params.direction = directionFilter
      }
      if (selectedDates[0] && selectedDates[1]) {
        params.dateFilterBy = dateFilterType
        params[
          dateFilterType === 'updatedAt' ? 'updatedAfter' : 'createdAfter'
        ] = selectedDates[0].utc().toISOString()
        params[
          dateFilterType === 'updatedAt' ? 'updatedBefore' : 'createdBefore'
        ] = selectedDates[1].utc().toISOString()
      }

      params.amountAbove = amountFilter[0] ?? undefined
      params.amountBelow = amountFilter[1] ?? undefined

      return (
        inputRef?.current?.value === '' &&
        applyFilter &&
        (await getWalletTransactions(params))
      )
    }

    setIsLoading(false)
    if (search) {
      setApplyFilter(false)
      params.search = search
    }

    if (search) {
      params.search = search
    }
    return !applyFilter && (await getWalletTransactions(params))
  }

  useEffect(() => {
    setPage(1)
    optimizedSearch()
  }, [search])

  const creditTransactionsQuery = useQuery({
    queryKey: [
      filterKey,
      isLoading,
      applyFilter,
      page,
      limit,
      selectedCreditTab,
    ],
    queryFn: fetchCreditTransactions,
  })
  const transactions = useMemo(
    () =>
      (creditTransactionsQuery.data && creditTransactionsQuery.data.PE) ||
      ([] as WalletTransactionListObj[]),
    [creditTransactionsQuery.data]
  )

  useEffect(() => {
    setExportData(
      transactions?.map((row: Transaction) => ({
        ...row,
        created_at: moment(row.created_at).format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment(row.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      }))
    )
  }, [transactions])

  const columns = [
    { header: 'Sr. No', accessorKey: 'srNo' },
    {
      header: 'Transaction ID',
      accessorKey: 'gui_wallet_transaction_id',
      sortable: true,
    },
    { header: 'Account ID', accessorKey: 'account_id', sortable: true },
    { header: 'Direction', accessorKey: 'credit_debit', sortable: true },
    { header: 'UTR No', accessorKey: 'reference_number', sortable: true },
    { header: 'Amount', accessorKey: 'charges_gst', sortable: true },
    { header: 'Fees', accessorKey: 'settled_amount', sortable: true },
    {
      header: 'Settled Amt',
      accessorKey: 'transaction_amount',
      sortable: true,
    },
    {
      header: 'Closing Balance',
      accessorKey: 'account_balance',
      sortable: true,
    },
    {
      header: 'Transaction Type',
      accessorKey: 'user_transaction_type',
      sortable: true,
    },
    { header: 'Status', accessorKey: 'status', sortable: true },
    { header: 'Created At', accessorKey: 'created_at', sortable: true },
  ]

  const pendingColumns = [
    ...columns,
    { header: 'Action', accessorKey: 'action' },
  ]

  const tableData = useMemo(() => {
    return transactions.map((transaction, index) => ({
      ...transaction,
      srNo: index + 1,
      charges_gst: getNumberInRupee(transaction.charges_gst || '', true),
      settled_amount: getNumberInRupee(transaction.settled_amount || '', true),
      transaction_amount: getNumberInRupee(
        transaction.transaction_amount || '',
        true
      ),
      account_balance: getNumberInRupee(
        transaction.account_balance || '',
        true
      ),
      status: capitalize(transaction.status?.split('_').join(' ')),
      created_at: moment(transaction.created_at).format('YYYY-MM-DD HH:mm:ss'),
      action:
        selectedCreditTab === 'pending' ? (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsLoadingAction({
                  btnId: transaction.wallet_transaction_id,
                  walletTransactionId: transaction.wallet_transaction_id,
                  accountId: transaction.account_id,
                  isApproveModalOpen: true,
                  btnIdx: 1,
                  utrNumber: transaction?.reference_number ?? '',
                  amount: transaction?.transaction_amount ?? '',
                  transactionTime: transaction?.created_at ?? '',
                  paymentRemark: '',
                })
              }}
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                rejectTransaction(
                  transaction?.account_id,
                  'REJECT',
                  transaction?.wallet_transaction_id
                )
              }}
            >
              Decline
            </Button>
          </div>
        ) : null,
    }))
  }, [transactions, selectedCreditTab])

  const rejectTransaction = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    const params: ApproveDepositParams = {
      status,
      accountId,
    }
    try {
      const response = await approveDeposits(params, walletTransactionId)
      creditTransactionsQuery.refetch()
      setIsLoading(true)
      toast({
        description: response?.message,
        variant: 'success',
      })
    } catch (err) {
      setIsLoading(false)
    }
    setIsLoadingAction({
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
  }

  const debounce = (func: Function) => {
    let timer: number | null
    return function () {
      if (timer) clearTimeout(timer)
      timer = window.setTimeout(() => {
        timer = null
        func()
      }, 500)
    }
  }
  const optimizedSearch = useMemo(
    () => debounce(creditTransactionsQuery.refetch),
    []
  )

  const transactionDetails = selectedTransaction ? (
    <WalletTransactionDetails
      isOpen={!!selectedTransaction}
      onClose={() => setSelectedTransaction(undefined)}
      transaction_id={selectedTransaction}
    />
  ) : (
    ''
  )
  return (
    <>
      {transactionDetails}
      <ApproveProcessPendingDepositsModal
        isLoadingAction={{
          ...isLoadingAction,
          paymentRemark: '',
        }}
        setIsLoadingAction={setIsLoadingAction}
        refetch={() => creditTransactionsQuery.refetch()}
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
          onSelect={(e) => setDateFilterType(e)}
          value={dateFilterType}
          setValue={setDateFilterType}
        />
        <FilterDateSelect
          header=""
          onDateSelect={(st, ed) => setSelectedDates([st, ed])}
        />
        <FilterNumber
          header="Amount"
          onChange={setAmountFilter}
          minRange={0}
          maxRange={1000000}
          step={100}
          prefix="₹"
        />
      </FilterDrawer>
      <Tabs value={selectedCreditTab} onValueChange={setSelectedCreditTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="pending">Process Pending Deposits</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            {selectedCreditTab === 'all' && <UploadCSV buttonText="Upload" />}
            {exportData && (
              <Button>
                <CSVLink
                  data={exportData as WalletTransactionListObj[]}
                  filename={`TransactionData_${moment(new Date()).format(
                    'MMMM Do YYYY, h:mm:ss a'
                  )}}.csv`}
                  headers={headers}
                >
                  Export
                </CSVLink>
              </Button>
            )}
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                ref={inputRef}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Transaction"
                className="pl-8"
              />
            </div>
            {/* <FilterButton
              filterPills={applyFilter ? filterPills : {}}
              openFilter={() => {
                setFilterOpen(true)
                setApplyFilter(false)
              }}
              removeFilter={(filterId) => {
                if (filterId === 'amount') {
                  setAmountFilter([null, null])
                }
                if (filterId === 'status') {
                  setStatusFilter('All')
                }
                if (filterId === 'dates') {
                  setSelectedDates([null, null])
                  setDateFilterType('createdAt')
                }
                setApplyFilter(false)
              }}
            /> */}
          </div>
        </div>

        <TabsContent value="all">
          <AccountTable
            columns={columns}
            data={tableData}
            totalItems={creditTransactionsQuery.data?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            isSearchable={false}
            isLoading={creditTransactionsQuery.isLoading}
            onRowClick={(row) =>
              setSelectedTransaction(row.wallet_transaction_id)
            }
          />
        </TabsContent>
        <TabsContent value="pending">
          <AccountTable
            columns={pendingColumns}
            data={tableData}
            totalItems={creditTransactionsQuery.data?.total || 0}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={(newPage, newLimit) => {
              setPage(newPage)
              if (newLimit) setLimit(newLimit)
            }}
            isSearchable={false}
            isLoading={creditTransactionsQuery.isLoading}
            onRowClick={(row) =>
              setSelectedTransaction(row.wallet_transaction_id)
            }
          />
        </TabsContent>
      </Tabs>
    </>
  )
}

export default CreditWalletTransactions
