'use client'
import React, { useState } from 'react'
import { DataTablePagination } from './data-table-pagination'
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
import { DataTableToolbar } from './data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  enableSearch: boolean
  enableDropdown: boolean
  search?: string
  onSearchChange?: (value: string) => void
  page: number
  limit: number
  onPageChange: (page: number) => void
  onRowChange: (limit: number) => void
  filter: string
  onChangeFilter: (filter: string) => void
  total: number
  refetch: () => void
  isLoading: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableSearch,
  enableDropdown,
  search,
  onSearchChange,
  page,
  limit,
  onPageChange,
  onRowChange,
  filter,
  onChangeFilter,
  total,
  isLoading,
}: DataTableProps<TData, TValue>) {
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

  return (
    <div className="space-y-4 h-full p-1 flex flex-col">
      <DataTableToolbar
        table={table}
        enableSearch={enableSearch}
        enableDropdown={enableDropdown}
        accountType={filter}
        search={search}
        onSearchChange={onSearchChange}
        onAccountTypeChange={onChangeFilter}
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
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading....
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}
                      className="cursor-pointer hover:bg-muted/50"
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
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </div>
      </div>
      <DataTablePagination
        table={table}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
        onRowChange={onRowChange}
        total={total}
      />
    </div>
  )
}
