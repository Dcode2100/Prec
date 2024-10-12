'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { Log } from '@/lib/types/getAllLogsType'

export const columnsForLogs = (): ColumnDef<Log>[] => [
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
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="User ID"
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
    accessorKey: 'full_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]  overflow-hidden ">
        <div className="truncate text-sm ">{row.getValue('full_name')}</div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Email"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-full truncate">
        <CopyableCell value={row.getValue('email')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]  overflow-hidden ">
        <div className="truncate text-sm text-highlight-red font-semibold">
          {row.getValue('type')}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'url',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="URL" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('url')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Occurence Time"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px]  flex flex-col text-xs">
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
