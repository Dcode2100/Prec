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
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  page: number
  limit: number
  onPageChange: (page: number) => void
  onRowChange: (limit: number) => void
  total: number
  isLoading: boolean
  onRowClick?: (row: TData) => void
}

export function DataTable<TData extends object, TValue>({
  columns,
  data,
  page,
  limit,
  onPageChange,
  onRowChange,
  total,
  isLoading,
  onRowClick = () => {},
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: (updater) => {
      setSorting((old) => {
        const newSorting =
          typeof updater === 'function' ? updater(old) : updater
        if (
          newSorting.length > 0 &&
          old.length > 0 &&
          newSorting[0].id === old[0].id &&
          newSorting[0].desc === old[0].desc
        ) {
          return []
        }
        return newSorting
      })
    },
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
    <div className="space-y-4 h-full flex flex-col">
      <div className="rounded-md border flex-grow overflow-hidden">
        <div className="overflow-auto h-full">
          <Table className="w-full min-w-[calc(100vw-140px)]">
            <TableHeader className="sticky top-0 z-10 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center ${
                            header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : ''
                          }`}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getCanSort() && (
                            <span className="ml-2">
                              {{
                                asc: <ArrowUp className="h-4 w-4" />,
                                desc: <ArrowDown className="h-4 w-4" />,
                                false: <ArrowUpDown className="h-4 w-4" />,
                              }[header.column.getIsSorted() as string] ?? ''}
                            </span>
                          )}
                        </div>
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
                      onClick={() => onRowClick(row.original)}
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
