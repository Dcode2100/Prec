'use client'
import React, { useEffect, useMemo, useState, useRef } from 'react'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import {
  AccountTable,
  FilterDrawer,
  FilterSelect,
  FilterNumber,
  FilterDateSelect,
  FilterRadioButtons,
} from '@/components/accountTable'
import { ColumnTable } from '@/lib/types'
import { capitalize, getNumberInRupee } from '@/utils/utils'
import {
  getWalletTransactions,
  initializeWalletTransfer,
  approveDeposits,
} from '@/lib/api/transactionsApi'
import {
  WalletTransactionListObj,
  TransactionsParams,
  TransactionStatus,
  InitializeWalletTransferParams,
  ApproveDepositParams,
} from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import WalletTransactionDetails from '@/components/sheets/WalletTransactionDetails'
import { Pe } from '@/lib/types/walletType'

// Define a type for the date range
type DateRange = [moment.Moment | null, moment.Moment | null];

// Define a type for the amount filter
type AmountFilter = [number | null, number | null];

const rangeToPill = (
  label: string,
  range: [number | null, number | null],
  isCurrency: boolean = false
): string => {
  const [min, max] = range
  if (min === null && max === null) return ''

  const formatValue = (value: number | null) => {
    if (value === null) return ''
    return isCurrency ? `₹${value.toLocaleString()}` : value.toString()
  }

  if (min !== null && max !== null) {
    return `${label}: ${formatValue(min)} - ${formatValue(max)}`
  } else if (min !== null) {
    return `${label}: ≥ ${formatValue(min)}`
  } else if (max !== null) {
    return `${label}: ≤ ${formatValue(max)}`
  }
  return ''
}

const dateRangeToPill = (
  dateRange: [moment.Moment | null, moment.Moment | null]
): string => {
  const [start, end] = dateRange
  if (!start || !end) return ''

  const formatDate = (date: moment.Moment) => date.format('MMM D, YYYY')
  return `Date: ${formatDate(start)} - ${formatDate(end)}`
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
  { value: 'transactionTime', label: 'Transaction Time', id: '2' },
]

const WalletTransactionTable = (): React.ReactElement => {
  const typeFilter = 'PE'
  const [filterOpen, setFilterOpen] = useState(false)
  const [directionFilter] = useState<string>('All')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [amountFilter, setAmountFilter] = useState<AmountFilter>([null, null])
  const [selectedDates, setSelectedDates] = useState<DateRange>([null, null])
  const [filterKey, setFilterKey] = useState<string[]>(['transactions'])
  const [applyFilter, setApplyFilter] = useState(false)
  const [isChange, setIsChange] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined)
  const [update, setUpdate] = useState(false)
  const [search, setSearch] = useState(false)
  const [newWaitlistData, setNewWaitlistData] = useState<WalletTransactionListObj[]>([])
  const [exportData, setExportData] = useState<WalletTransactionListObj[]>([])
  const [dateFilterType, setDateFilterType] = useState('createdAt')
  const [searchValue, setSearchValue] = useState('')
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

  const queryKeys = useMemo(
    () => [
      'transactions',
      typeFilter,
      directionFilter,
      amountFilter,
      statusFilter,
      selectedDates,
      page,
      limit,
      search,
    ],
    [
      typeFilter,
      directionFilter,
      amountFilter,
      statusFilter,
      selectedDates,
      page,
      limit,
      search,
    ]
  )

  const [isWalletTransactionFetching, setIsWalletTransactionFetching] =
    useState(false)

  const fetchTransactions = async () => {
    const params: TransactionsParams = applyFilter
      ? {
          page,
          limit,
          status: statusFilter,
        }
      : {
          direction: directionFilter !== 'All' ? directionFilter : undefined,
          page,
          limit,
          status: statusFilter,
        }
    // direction filter
    // apply filters only if flag is true
    if (applyFilter) {
      inputRef.current.value = ''
      setSearch(false)
      setUpdate(false)
      // status filter
      if (directionFilter && directionFilter !== 'All') {
        params.direction = directionFilter
      }

      if (typeFilter === 'PE') {
        params.type = typeFilter
      } else {
        params.type = typeFilter
      }

      // updated at date filter
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

      // amount filters
      params.amountAbove = amountFilter[0] ?? undefined
      params.amountBelow = amountFilter[1] ?? undefined

      return (
        // inputRef?.current?.value === "" &&
        applyFilter && (await getWalletTransactions(params))
      )
    }
    // get transactions by account id
    setIsLoading(false)
    if (search) {
      setIsWalletTransactionFetching(true)
      setApplyFilter(false)
      const params: TransactionsParams = {
        search: inputRef.current?.value,
      }
      const data =
        inputRef.current?.value !== '' && (await getWalletTransactions(params))
      data && setNewWaitlistData(data?.PE)
      inputRef.current?.value !== '' && setUpdate(true)
      inputRef.current?.value === '' && setUpdate(false)
      setIsWalletTransactionFetching(false)
    }
    return (
      // inputRef?.current?.value === "" &&
      !search && !applyFilter && (await getWalletTransactions(params))
    )
  }

  useEffect(() => {
    setIsChange(false)
  }, [isChange === true])

  const transactionsQuery = useQuery({
    queryKey: [filterKey, isLoading, applyFilter, page, limit],
    queryFn: fetchTransactions,
  })
  const transactions = useMemo(
    () => transactionsQuery?.data?.PE || ([] as WalletTransactionListObj[]),
    [transactionsQuery.data]
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    search && fetchTransactions()
    setSearch(false)
  }, [search])

  const debounce = (func: Function) => {
    let timer: number | null

    return function () {
      if (timer) clearTimeout(timer)

      timer = window.setTimeout(() => {
        timer = null
        func()
        setSearch(true)
      }, 500)
    }
  }

  // const optimizedSearch = useMemo(() => debounce(fetchTransactions), [])

  useEffect(() => {
    setExportData(
      update
        ? newWaitlistData
        : transactions?.map((row: any) => {
            row.created_at = moment(row?.created_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            row.updated_at = moment(row?.updated_at).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            row.transaction_time
              ? (row.transaction_time = moment(row?.transaction_time).format(
                  'YYYY-MM-DD HH:mm:ss'
                ))
              : ''
            return row
          })
    )
  }, [transactions])

  useEffect(() => {
    if (!applyFilter) {
      return
    }
    setFilterKey(queryKeys as string[])
  }, [queryKeys])

  const filterPills = {
    //Extra filter pills removed for positioning.
    status: capitalize(statusFilter),
    amount: rangeToPill('amount', amountFilter),
    dates: dateRangeToPill(selectedDates),
  }

  const removeFilter = (filterId: string) => {
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
  }

  const transactionDetails = selectedTransaction ? (
    <WalletTransactionDetails
      isOpen={!!selectedTransaction}
      onClose={() => setSelectedTransaction(undefined)}
      transaction_id={selectedTransaction}
    />
  ) : (
    ''
  )

  const [isLoadingActionButton, setIsLoadingActionButton] = useState<{
    walletTransactionId: string;
    btnId: number;
    transactionStatus: string;
  }>({
    walletTransactionId: '',
    btnId: 0,
    transactionStatus: '',
  })

  const handleDebitTransfers = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    try {
      const params: InitializeWalletTransferParams = {
        status,
        walletTransactionId,
      }
      const response = await initializeWalletTransfer(accountId, params)
    } catch (err) {
    } finally {
      transactionsQuery.refetch()
    }
    setIsLoadingActionButton({
      walletTransactionId: '',
      transactionStatus: '',
      btnId: 0,
    })
  }

  const handleCreditTransfers = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    try {
      const params: ApproveDepositParams = {
        status,
        accountId,
      }
      const response = await approveDeposits(params, walletTransactionId)
    } catch (err) {
    } finally {
      transactionsQuery.refetch()
    }
    setIsLoadingActionButton({
      walletTransactionId: '',
      transactionStatus: '',
      btnId: 0,
    })
  }

  const walletTransactionsToTableRows = (
    transactions: Pe[] | undefined
  ): (string | number | moment.Moment | JSX.Element)[][] => {
    return (transactions || []).map((transaction, i) => {
      let arr = [
        i + 1,
        transaction?.gui_wallet_transaction_id || '',
        transaction?.wallet?.user?.gui_account_id || '',
        capitalize(transaction?.credit_debit || ''),
        transaction?.reference_number || '-',
        getNumberInRupee(transaction?.transaction_amount || '', true),
        getNumberInRupee(transaction?.charges_gst || '', true),
        getNumberInRupee(transaction?.settled_amount || '', true),
        getNumberInRupee(transaction?.account_balance || '', true),
        transaction?.user_transaction_type || '',
        capitalize(transaction?.status?.split('_').join(' ')),
        moment(transaction?.created_at || ''),
      ]
      if (
        process.env.ENVIRONMENT === 'development' ||
        process.env.ENVIRONMENT === 'stage'
      ) {
        return [
          ...arr,
          <Flex
            variant={'ghost'}
            style={{ gap: '5px' }}
            key={transaction.gui_wallet_transaction_id}
          >
            <Button
              key={i}
              title={'Approve'}
              colorScheme={'green'}
              isDisabled={
                isLoadingActionButton.walletTransactionId ===
                  transaction?.wallet_transaction_id ||
                transaction.status === 'completed' ||
                transaction.status === 'rejected'
              }
              isLoading={
                isLoadingActionButton.walletTransactionId ===
                  transaction?.wallet_transaction_id &&
                isLoadingActionButton.btnId === 1
              }
              onClick={(e) => {
                e.stopPropagation()
                setIsLoadingActionButton({
                  walletTransactionId: transaction.wallet_transaction_id,
                  transactionStatus: 'APPROVE',
                  btnId: 1,
                })
                if (transaction.credit_debit === 'DEBIT') {
                  handleDebitTransfers(
                    transaction.account_id,
                    'APPROVE',
                    transaction.wallet_transaction_id
                  )
                }
              }}
            >
              &#10003;
            </Button>
            ,
            <Button
              key={i + 1}
              title={'Reject'}
              colorScheme={'red'}
              isDisabled={
                isLoadingActionButton.walletTransactionId ===
                  transaction?.wallet_transaction_id ||
                transaction.status === 'completed' ||
                transaction.status === 'rejected'
                // rejected
              }
              isLoading={
                isLoadingActionButton.walletTransactionId ===
                  transaction?.wallet_transaction_id &&
                isLoadingActionButton.btnId === 2
              }
              onClick={(e) => {
                e.stopPropagation()
                setIsLoadingActionButton({
                  walletTransactionId: transaction.wallet_transaction_id,
                  transactionStatus: 'REJECT',
                  btnId: 2,
                })
                if (transaction.credit_debit === 'DEBIT') {
                  handleDebitTransfers(
                    transaction.account_id,
                    'REJECT',
                    transaction.wallet_transaction_id
                  )
                } else if (transaction.credit_debit === 'CREDIT') {
                  handleCreditTransfers(
                    transaction.account_id,
                    'REJECT',
                    transaction.wallet_transaction_id
                  )
                }
              }}
            >
              &#x2717;
            </Button>
            ,
          </Flex>,
        ]
      } else {
        return arr
      }
    })
  }

  const handleSearch = (value: string) => {
    setSearchValue(value)

    setSearch(true)
    fetchTransactions()
  }

  const columns: ColumnTable<WalletTransactionListObj>[] = [
    { header: 'Transaction ID', accessorKey: 'gui_wallet_transaction_id' },
    {
      header: 'Account ID',
      accessorKey: 'transactions.wallet.user.gui_account_id',
    },
    { header: 'Direction', accessorKey: 'credit_debit' },
    { header: 'UTR No', accessorKey: 'reference_number' },
    { header: 'Amount', accessorKey: 'transaction_amount', sortable: true },
    { header: 'Fees', accessorKey: 'charges_gst', sortable: true },
    { header: 'Settled Amt', accessorKey: 'settled_amount', sortable: true },
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

  return (
    <>
      {transactionDetails}
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

      <div className="">
        <div className="flex items-center justify-between mb-4">
          {transactions && (
            <Button className="mr-4">
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
          )}
          {/* <FilterButton
            filterPills={applyFilter ? filterPills : {}}
            openFilter={() => setFilterOpen(true)}
            removeFilter={removeFilter}
          /> */}
        </div>
        <AccountTable
          columns={columns}
          data={update ? newWaitlistData : transactions}
          isLoading={
            transactionsQuery?.isLoading || isWalletTransactionFetching
          }
          totalItems={
            update ? newWaitlistData.length : transactionsQuery.data?.total || 0
          }
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={(pageNo, newLimit) => {
            setPage(pageNo)
            if (newLimit) setLimit(newLimit)
          }}
          onRowClick={(row) =>
            setSelectedTransaction(row.wallet_transaction_id)
          }
          isSearchable={true}
          onSearch={handleSearch}
        />
      </div>
    </>
  )
}

export default WalletTransactionTable