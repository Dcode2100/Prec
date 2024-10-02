'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table'
import type {
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table'
import { DateRange } from 'react-day-picker'
import Loader from '@/components/Loader'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  search: string
  onSearchChange: (value: string) => void
  page: number
  onPageChange: (page: number) => void
  total: number
  accountType: string
  onAccountTypeChange: (value: string) => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  search,
  onSearchChange,
  page,
  onPageChange,
  total,
  accountType,
  onAccountTypeChange,
  dateRange,
  onDateRangeChange,
  isLoading,
}: DataTableProps<TData, TValue>) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const handleRowClick = (row: any) => {
    const accountType =
      row.type === 'Broking' ? 'BK' : row.type === 'MF' ? 'MF' : 'PE'
    router.push(`/accounts/${accountType}-${row.account_id}`)
  }

  return (
    <div className="space-y-4 h-full p-1 flex flex-col">
      <DataTableToolbar
        table={table}
        search={search}
        onSearchChange={onSearchChange}
        accountType={accountType}
        onAccountTypeChange={onAccountTypeChange}
        fetchedData={data}
        dateRange={dateRange}
        onDateRangeChange={onDateRangeChange}
      />

      <div className="rounded-md border flex-grow overflow-hidden">
        <div className="overflow-auto h-full">
          <Table className="w-full min-w-[calc(100vw-140px)]">
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => handleRowClick(row.original)}
                    className="cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-[calc(100vh-260px)] bg-none text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination
        table={table}
        page={page}
        onPageChange={onPageChange}
        total={total}
      />
    </div>
  )
}
