'use client'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/CustomTable/data-table'
import { getPCHoldingsByAccId } from '@/lib/api/accountApi'
import { getNumberInRupee } from '@/utils/utils'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { AccountWisePcHoldingData } from '@/lib/types/types'

const PCHoldingsTable = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountId = parts.slice(1).join('-')

  const accountHoldingsQuery = useQuery({
    queryKey: ['pc_acc_holdings', accountId, currentPage, itemsPerPage],
    queryFn: async () => {
      try {
        setIsLoading(true)
        return await getPCHoldingsByAccId(accountId)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return
        }
        throw error
      } finally {
        setIsLoading(false)
      }
    },
  })

  const columns: ColumnDef<AccountWisePcHoldingData>[] = useMemo(
    () => [
      {
        accessorKey: 'gui_id',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Holding ID" />
        ),
        cell: ({ row }) => <div>{row.getValue('gui_id')}</div>,
        enableSorting: false,
      },
      {
        accessorKey: 'symbol',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Symbol" />
        ),
        cell: ({ row }) => <div>{row.getValue('symbol')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'rate_of_returns',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Returns" />
        ),
        cell: ({ row }) => <div>{row.getValue('rate_of_returns')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'tenure',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Tenure" />
        ),
        cell: ({ row }) => <div>{row.getValue('tenure')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'subscription_amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Subscription" />
        ),
        cell: ({ row }) => (
          <div>{getNumberInRupee(row.getValue('subscription_amount'))}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'min_repayment_amount',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Min Repayment" />
        ),
        cell: ({ row }) => (
          <div>{getNumberInRupee(row.getValue('min_repayment_amount'))}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => <div>{row.getValue('status')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'tentative_end_date',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Maturity date" />
        ),
        cell: ({ row }) => <div>{row.getValue('tentative_end_date')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'created_at',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Created At" />
        ),
        cell: ({ row }) => <div>{row.getValue('created_at')}</div>,
        enableSorting: true,
      },
    ],
    []
  )

  const AccountPcHeaders = [
    { label: 'GUI ID', key: 'gui_id' },
    { label: 'Symbol', key: 'symbol' },
    { label: 'Status', key: 'status' },
    { label: 'UI Rate of Returns', key: 'ui_rate_of_returns' },
    { label: 'Rate of Returns', key: 'rate_of_returns' },
    { label: 'Tenure', key: 'tenure' },
    { label: 'Tentative Tenure', key: 'tentative_tenure' },
    { label: 'Subscription Amount', key: 'subscription_amount' },
    { label: 'Min Repayment Amount', key: 'min_repayment_amount' },
    { label: 'Start Date', key: 'start_date' },
    { label: 'End Date', key: 'end_date' },
    { label: 'Trade Start Date', key: 'trade_start_date' },
    { label: 'Trade End Date', key: 'trade_end_date' },
    { label: 'Tentative Start Date', key: 'tentative_start_date' },
    { label: 'Tentative End Date', key: 'tentative_end_date' },
    { label: 'Repaid Date', key: 'repaid_date' },
    { label: 'To', key: 'to' },
    { label: 'From', key: 'from' },
    { label: 'Buy Transaction Fees', key: 'buy_transaction_fees' },
    { label: 'Returns', key: 'returns' },
    { label: 'Charges', key: 'charges' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
  ]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg tracking-tight">PC Holdings</h2>
        <CSVLink
          data={accountHoldingsQuery?.data || []}
          filename={`PCHoldingsData_${moment(new Date()).format(
            'MMMM_Do_YYYY_h_mm_ss_a'
          )}.csv`}
          headers={AccountPcHeaders}
        >
          <Button disabled={!accountHoldingsQuery?.data?.length}>
            Export CSV
          </Button>
        </CSVLink>
      </div>

      <DataTable
        columns={columns}
        data={accountHoldingsQuery?.data || []}
        page={currentPage}
        limit={itemsPerPage}
        total={accountHoldingsQuery?.data?.length || 0}
        isLoading={isLoading}
        onPageChange={() => {}}
        onRowChange={() => {}}
      />
    </>
  )
}

export default PCHoldingsTable
