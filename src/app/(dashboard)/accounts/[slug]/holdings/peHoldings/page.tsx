'use client'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/CustomTable/data-table'
import { getAccountHoldings } from '@/lib/api/accountApi'
import { getNumberInRupee, getGlobalItem } from '@/utils/utils'
import ConfirmationModal from '@/components/modals/ConfirmationModal'
import ApplyRightsIssueModal from '@/components/modals/ApplyRightsIssueModal'
import TransferHoldingModal from '@/components/modals/TransferHoldingModal'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import { CSVLink } from 'react-csv'
import moment from 'moment'
import { AccountWiseHoldingData } from '@/lib/types/accountType'

const HoldingsTable = (): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false)
  const userType = getGlobalItem('type')
  const [openConfirmationModal, setOpenConfirmationModal] =
    useState<boolean>(false)
  const [openApplyRightsIssueModal, setOpenApplyRightsIssueModal] =
    useState<boolean>(false)
  const [openTransferModal, setOpenTransferModal] = useState<boolean>(false)
  const [transferSuccessful, setTransferSuccessful] = useState(false)
  const [holdingId, setHoldingId] = useState<string>('')
  const [currentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountId = parts.slice(1).join('-')

  const accountHoldingsQuery = useQuery({
    queryKey: [
      'PE-holdings',
      accountId,
      transferSuccessful,
      currentPage,
      itemsPerPage,
    ],
    queryFn: async () => {
      try {
        setIsLoading(true)
        return await getAccountHoldings(accountId, 'PE')
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

  const handleTransferSuccess = () => {
    setTransferSuccessful((prev) => !prev)
    setOpenTransferModal(false)
  }

  const columns: ColumnDef<AccountWiseHoldingData>[] = useMemo(
    () => [
      {
        accessorKey: 'token',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Token" />
        ),
        cell: ({ row }) => <div>{row.getValue('token')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'symbol',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Symbol" />
        ),
        cell: ({ row }) => (
          <div>{(row.getValue('symbol') as string).split('-')[0]}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'quantity',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Quantity" />
        ),
        cell: ({ row }) => <div>{String(row.getValue('quantity'))}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'price',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Price" />
        ),
        cell: ({ row }) => (
          <div>{getNumberInRupee(row.getValue('price'), true)}</div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'investment',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Investment" />
        ),
        cell: ({ row }) => (
          <div>
            {getNumberInRupee(
              Number(row.original.price) * Number(row.original.quantity)
            )}
          </div>
        ),
        enableSorting: true,
      },
      {
        accessorKey: 'curr_price',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="LTP" />
        ),
        cell: ({ row }) => <div>{row.getValue('curr_price')}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'pnl',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="PNL" />
        ),
        cell: ({ row }) => <div>{getNumberInRupee(row.getValue('pnl'))}</div>,
        enableSorting: true,
      },
      {
        accessorKey: 'pnl_percentage',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Percentage PNL" />
        ),
        cell: ({ row }) => <div>{`${row.getValue('pnl_percentage')}%`}</div>,
        enableSorting: true,
      },
      {
        id: 'transfer',
        header: 'Transfer Holding',
        cell: ({ row }) => (
          <Button
            variant="outline"
            disabled={row.original.sold === true}
            onClick={() => {
              setHoldingId(row.original.id)
              setOpenTransferModal(true)
            }}
          >
            Transfer
          </Button>
        ),
      },
      {
        id: 'update',
        header: 'Update holding',
        cell: ({ row }) =>
          row.original.sold ? (
            <span className="text-red-500 w-full border-red-500">Sold</span>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setHoldingId(row.original.id)
                setOpenConfirmationModal(true)
              }}
            >
              Update
            </Button>
          ),
        enableSorting: false,
      },
      {
        id: 'apply',
        header: 'Apply rights issue',
        cell: ({ row }) => (
          <Button
            variant="outline"
            onClick={() => {
              setHoldingId(row.original.id)
              setOpenApplyRightsIssueModal(true)
            }}
          >
            Apply
          </Button>
        ),
        enableSorting: false,
      },
    ],
    [userType]
  )

  const AccountHeaders = [
    { label: 'Token', key: 'token' },
    { label: 'Symbol', key: 'symbol' },
    { label: 'Net Quantity', key: 'quantity' },
    { label: 'Net Average Price', key: 'price' },
    { label: 'Net Amount', key: 'amount' },
    { label: 'Buy Quantity', key: 'buy_quantity' },
    { label: 'Buy Amount', key: 'buy_amount' },
    { label: 'Sell Quantity', key: 'sell_quantity' },
    { label: 'Sell Price', key: 'sell_price' },
    { label: 'Sell Amount', key: 'sell_amount' },
    { label: 'Sold', key: 'sold' },
    { label: 'Current Price', key: 'curr_price' },
    { label: 'Current Value', key: 'curr_value' },
    { label: 'PnL', key: 'pnl' },
    { label: 'PnL Percentage', key: 'pnl_percentage' },
    { label: 'Buy Transaction Fees', key: 'buy_transaction_fees' },
    { label: 'Sell Transaction Fees', key: 'sell_transaction_fees' },
  ]

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg tracking-tight">PE Holdings</h2>
        <CSVLink
          data={accountHoldingsQuery?.data || []}
          filename={`PEHoldingsData_${moment(new Date()).format(
            'MMMM_Do_YYYY_h_mm_ss_a'
          )}.csv`}
          headers={AccountHeaders}
        >
          <Button>Export</Button>
        </CSVLink>
      </div>

      <ConfirmationModal
        openConfirmationModal={openConfirmationModal}
        setOpenConfirmationModal={setOpenConfirmationModal}
        sold={true}
        holding_id={holdingId}
      />
      <ApplyRightsIssueModal
        openApplyRightsIssueModal={openApplyRightsIssueModal}
        setOpenApplyRightsIssueModal={setOpenApplyRightsIssueModal}
        holding_id={holdingId}
        accountId={accountId}
      />
      <TransferHoldingModal
        isOpen={openTransferModal}
        onClose={() => setOpenTransferModal(false)}
        holdingId={holdingId}
        sendersAccountId={accountId}
        onTransferSuccess={handleTransferSuccess}
      />
      <DataTable
        columns={columns as ColumnDef<AccountWiseHoldingData>[]}
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

export default HoldingsTable
