'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { DashboardUserEvent } from '@/lib/types/dashboardUserType'
import { ReactNode } from 'react'

export const columnsForDashboardEvents = (
  ActionButton: (props: { row: DashboardUserEvent }) => ReactNode
): ColumnDef<DashboardUserEvent>[] => [
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
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" className="text-sm" />
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
  {
    accessorKey: 'ip_address',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="IP Address"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="">
        <CopyableCell value={row.getValue('ip_address')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {`${row.original.first_name || '-'} ${row.original.last_name || '-'}`}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-xs font-semibold text-highlight-yellow">
        {row.getValue('action')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'device_info',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Device Info"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <div>{`${row.original.device_info.os?.name || '-'} ${
          row.original.device_info.os?.version || '-'
        }`}</div>
        <div className="text-xs text-muted-foreground">
          {`${row.original.device_info.device?.vendor || '-'} ${
            row.original.device_info.device?.model || '-'
          }`}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'browser',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Browser"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <div>{row.original.device_info.browser?.name || '-'}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.device_info.browser?.major &&
          row.original.device_info.browser?.version
            ? `v${row.original.device_info.browser.major} (${row.original.device_info.browser.version})`
            : '-'}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-sm"
      />
    ),
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]
