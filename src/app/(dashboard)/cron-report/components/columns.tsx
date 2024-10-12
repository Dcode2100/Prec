'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { CronRecord } from '@/lib/types/getAllCronType'

// Helper function to copy text to clipboard

export const columnsForCronReport = (): ColumnDef<CronRecord>[] => [
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
    accessorKey: 'cron_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="p-2">
        <CopyableCell value={row.getValue('cron_name')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'start_time',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Start Time"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('start_time'))
      return (
        <div className="flex  text-sm gap-2">
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
  {
    accessorKey: 'end_time',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="End Time"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const endTime = moment(row.getValue('end_time'))
      return (
        <div className="flex text-sm gap-2">
          <span className="truncate font-bold text-muted-foreground">
            {endTime.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {endTime.format('h:mm A')}
          </span>
        </div>
      )
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
      <div className=" overflow-hidden">
        <div className="truncate text-sm text-highlight-yellow font-semibold">
          {row.getValue('status')}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'reason',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Reason"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="overflow-hidden">
        <div className="truncate text-sm text-highlight-yellow font-semibold">
          {row.getValue('reason')}
        </div>
      </div>
    ),
    enableSorting: false,
  },
]
