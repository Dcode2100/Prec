'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { CoinTransactionResponse } from '@/lib/types/transactionTypes'
import { capitalize } from '@/utils/utils'

export const columnsForCoinTransactions =
  (): ColumnDef<CoinTransactionResponse>[] => [
    {
      id: 'serialNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Sr No."
          className="text-sm "
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs text-center">{row.index + 1}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'gui_transaction_id',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Transaction ID"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[150px] ">
          <CopyableCell value={row.getValue('gui_transaction_id')} />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'gui_account_id',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Account ID"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[150px] ">
          <CopyableCell value={row.getValue('gui_account_id')} />
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'direction',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Direction"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[100px] text-sm">{row.getValue('direction')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'coins',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Coins"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[100px] text-sm">{row.getValue('coins')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'reward_type',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Reward Type"
          className="text-sm"
        />
      ),
      cell: ({ row }) => {
        const rewardType = row.getValue('reward_type') as string
        let displayText = rewardType
        if (rewardType === 'REDEMPTION_ORDER') {
          displayText = 'Redemption Order'
        } else if (rewardType === 'REFEREE_ORDER') {
          displayText = 'Referee Order'
        } else if (!rewardType) {
          displayText = 'Self SignUp'
        }
        return <div className="w-[150px] text-sm">{displayText}</div>
      },
      enableSorting: false,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Status"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[150px] text-sm">
          {capitalize((row.getValue('status') as string).split('_').join(' '))}
        </div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Description"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="w-[200px] text-sm">{row.getValue('description')}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'created_at',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created At"
          className="text-sm"
        />
      ),
      cell: ({ row }) => {
        const createdAt = moment(row.getValue('created_at'))
        return (
          <div className="w-[120px] flex flex-col text-xs">
            <span className="truncate font-bold text-muted-foreground">
              {createdAt.format('DD-MM-YYYY')}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {createdAt.format('h:mm A')}
            </span>
          </div>
        )
      },
      enableSorting: false,
    },
  ]
