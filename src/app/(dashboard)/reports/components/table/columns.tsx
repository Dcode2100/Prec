'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'

import moment from 'moment'

import { Report } from '@/lib/types/reportType'
import { Button } from '@/components/ui/button'; // Assuming you have a Button component

export const columnsForOrderReports: ColumnDef<Report>[] = [
  {
    accessorKey: 'serialNumber',
    header: 'Sr. No',
    cell: ({ row }) => {
      return <div className="text-center">{row.index + 1}</div>
    },
    enableSorting: false,
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.getValue('type')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'start_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction start date" />
    ),
    cell: ({ row }) => {
      const startTime = moment(row.getValue('start_time'))
      return (
        <div className="w-[120px] flex flex-col">
          <span className="truncate font-bold text-muted-foreground">
            {startTime.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {startTime.format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'end_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction end date" />
    ),
    cell: ({ row }) => {
      const endTime = moment(row.getValue('end_time'))
      return (
        <div className="w-[120px] flex flex-col">
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
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px] flex flex-col">
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
    accessorKey: 'updated_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated At" />
    ),
    cell: ({ row }) => {
      const updatedAt = moment(row.getValue('updated_at'))
      return (
        <div className="w-[120px] flex flex-col">
          <span className="truncate font-bold text-muted-foreground">
            {updatedAt.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {updatedAt.format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original
      return (
        <Button
          onClick={() => handleDownloadReport(report)}
          variant="outline"
          size="sm"
        >
          Download Report
        </Button>
      )
    },
  },
]

