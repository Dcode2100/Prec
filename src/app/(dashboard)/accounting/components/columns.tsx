'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import { DaywiseTransaction } from '@/lib/types/types'
import { getNumberInRupee } from '@/utils/utils'

export const columnsForAccountingTransactions =
  (): ColumnDef<DaywiseTransaction>[] => [
    {
      id: 'serialNumber',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Sr No."
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div className="text-xs text-center">{row.index + 1}</div>
      ),
      enableSorting: false,
    },
    {
      accessorKey: 'date',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Date"
          className="text-sm"
        />
      ),
      cell: ({ row }) => {
        const date = moment(row.getValue('date'))
        return (
          <div className="flex flex-col text-xs">
            <span className="truncate font-bold text-muted-foreground">
              {date.format('YYYY-MM-DD')}
            </span>
          </div>
        )
      },
      enableSorting: true,
    },
    {
      accessorKey: 'credit',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Credit"
          className="text-sm"
        />
      ),
      cell: ({ row }) => <div>{getNumberInRupee(row.getValue('credit'))}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'debit',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Debit"
          className="text-sm"
        />
      ),
      cell: ({ row }) => <div>{getNumberInRupee(row.getValue('debit'))}</div>,
      enableSorting: true,
    },
    {
      accessorKey: 'closing_balance',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Closing Balance"
          className="text-sm"
        />
      ),
      cell: ({ row }) => (
        <div>{getNumberInRupee(row.getValue('closing_balance'))}</div>
      ),
      enableSorting: true,
    },
  ]
