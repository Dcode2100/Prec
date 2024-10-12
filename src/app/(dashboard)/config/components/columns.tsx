'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import CopyableCell from '@/components/CopyCell'
import { ConfigData } from '@/lib/types/configTypes'

export const columnsForConfig = (): ColumnDef<ConfigData>[] => [
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
    enableSorting: true,
  },
  {
    accessorKey: 'key',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Key" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('key')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Value"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        <CopyableCell value={row.getValue('value')} />
      </div>
    ),
    enableSorting: false,
  },
  
]
