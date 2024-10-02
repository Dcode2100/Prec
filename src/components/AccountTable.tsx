'use client'

import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CopyIcon,
  TrashIcon,
  DownloadIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'
import Loader from './Loader'
import { SearchIcon, CheckIcon, XIcon, ClockIcon } from 'lucide-react'
import { format } from 'date-fns'
import { CaretSortIcon, Cross2Icon } from '@radix-ui/react-icons'
import { ColumnDef } from '@tanstack/react-table'
const stylingKeys = {
  success: ['active', 'completed', 'approved'],
  warning: ['pending', 'in progress'],
  failed: ['failed', 'rejected', 'error'],
}

interface Column<T> {
  header: string
  accessorKey: keyof T
  cell?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  totalItems: number
  itemsPerPage: number
  currentPage: number
  onPageChange: (page: number, pageSize?: number) => void
  onSearch?: (value: string) => void
  onFilter?: (key: string, value: string) => void
  filterOptions?: { key: string; options: string[] }[]
  isSearchable?: boolean
  isLoading?: boolean
  onDelete?: (rowIndex: number) => void
  onDownload?: (rowIndex: number) => void
  onClickSendEmail?: (row: T) => void
  onRowClick?: (row: T) => void
}

export function AccountTable<T extends object>({
  isSearchable,
  columns,
  data,
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
  onSearch,
  onFilter,
  filterOptions,
  isLoading,
  onDelete,
  onDownload,
  onClickSendEmail,
  onRowClick,
}: DataTableProps<T>) {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState('')
  const [sorting, setSorting] = useState<{
    key: keyof T
    direction: 'asc' | 'desc'
  } | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{
    row: number
    col: number
  } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const { toast } = useToast()

  const totalPages = Math.ceil(totalItems / itemsPerPage)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
    onSearch?.(e.target.value)
  }

  const handleRowClick = (row: T) => {
    if (onRowClick) {
      onRowClick(row);
    } else if ('account_id' in row) {
      const accountType =
        (row as any).type === 'Broking'
          ? 'BK'
          : (row as any).type === 'MF'
          ? 'MF'
          : 'PE'
      router.push(`/accounts/${accountType}-${(row as any).account_id}`)
    }
  }

  const handleSort = (key: keyof T) => {
    if (sorting?.key === key) {
      setSorting({
        key,
        direction: sorting.direction === 'asc' ? 'desc' : 'asc',
      })
    } else {
      setSorting({ key, direction: 'asc' })
    }
  }

  const sortedData = useMemo(() => {
    if (!sorting) return data
    return [...data].sort((a, b) => {
      if (a[sorting.key] < b[sorting.key])
        return sorting.direction === 'asc' ? -1 : 1
      if (a[sorting.key] > b[sorting.key])
        return sorting.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sorting])

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      description: 'Value copied to clipboard',
      duration: 1500,
    })
  }

  const getItemColor = (value: any, header: string): string => {
    if (typeof value !== 'string') return ''
    const lowerValue = value.toLowerCase()
    if (['completed', 'success'].includes(lowerValue)) return 'text-green-500'
    if (['pending', 'transfer pending', 'verification pending', 'locked'].includes(lowerValue)) return 'text-yellow-500'
    if (['rejected', 'failed', 'cancelled'].includes(lowerValue)) return 'text-red-500'
    if (header.toLowerCase() === 'type') {
      if (value === 'Broking') return 'text-orange-500'
      if (value === 'MF') return 'text-blue-500'
      if (value === 'PE') return 'text-purple-500'
    }
    return ''
  }

  const renderStatus = (status: string) => {
    const lowerStatus = status.toLowerCase()
    let icon
    if (['completed', 'success'].includes(lowerStatus)) {
      icon = <CheckIcon className="h-4 w-4 mr-1" />
    } else if (['rejected', 'failed', 'cancelled'].includes(lowerStatus)) {
      icon = <XIcon className="h-4 w-4 mr-1" />
    } else {
      icon = <ClockIcon className="h-4 w-4 mr-1" />
    }

    return (
      <div className="flex items-center">
        {icon}
        <span>{status}</span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const ISTOffset = 330
    const ISTTime = new Date(date.getTime() + ISTOffset * 60000)
    const dateStr = format(ISTTime, 'dd-MM-yyyy')
    const timeStr = format(ISTTime, 'hh:mm a')
    return (
      <div>
        <div>{dateStr}</div>
        <div className="text-muted-foreground">{timeStr}</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {isSearchable && (
          <div className="flex items-center max-w-sm relative">
            <SearchIcon className="h-5 w-5 absolute left-3" />
            <Input
              className="pl-10"
              placeholder="Search..."
              value={searchValue}
              onChange={handleSearch}
            />
          </div>
        )}
        {filterOptions && onFilter && (
          <div className="flex space-x-2">
            {filterOptions.map((filter) => (
              <Select
                key={filter.key}
                onValueChange={(value) => onFilter(filter.key, value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={`Filter by ${filter.key}`} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.header}
                    onClick={() =>
                      column.sortable && handleSort(column.accessorKey)
                    }
                    className={cn(
                      'cursor-pointer',
                      column.sortable && 'hover:bg-muted'
                    )}
                  >
                    <div className="flex items-center">
                      {column.header}
                      {column.sortable && (
                        <span className="ml-2">
                          {sorting?.key === column.accessorKey ? (
                            sorting.direction === 'asc' ? (
                              <ArrowUpIcon className="h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="h-4 w-4" />
                            )
                          ) : (
                            <CaretSortIcon className="h-4 w-4" />
                          )}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
                {(onDelete || onDownload || onClickSendEmail) && (
                  <TableHead>Actions</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onDelete || onDownload || onClickSendEmail ? 1 : 0)}>
                    <div className="h-[calc(100vh-330px)] w-full flex items-center justify-center">
                      <Loader />
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={columns.length + (onDelete || onDownload || onClickSendEmail ? 1 : 0)}>
                    <div className="text-center py-4">No data available</div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedData.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    onClick={() => handleRowClick(row)}
                    className="cursor-pointer hover:bg-muted/50"
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={column.accessorKey as string}
                        className={cn(
                          getItemColor(
                            row[column.accessorKey] as string,
                            column.header
                          ),
                          'relative'
                        )}
                        onMouseEnter={() =>
                          setHoveredCell({ row: rowIndex, col: colIndex })
                        }
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div
                          className="flex items-center"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(row[column.accessorKey] as string)
                          }}
                        >
                          {column.header.toLowerCase() === 'created at' ? (
                            formatDate(row[column.accessorKey] as string)
                          ) : column.header.toLowerCase() === 'status' ? (
                            renderStatus(row[column.accessorKey] as string)
                          ) : column.header.toLowerCase() === 'type' &&
                            ['Broking', 'MF', 'PE'].includes(
                              row[column.accessorKey] as string
                            ) ? (
                            <Badge variant="outline">
                              {row[column.accessorKey] as string}
                            </Badge>
                          ) : (
                            column.cell?.(row[column.accessorKey], row) ??
                            (row[column.accessorKey] as React.ReactNode)
                          )}
                          {hoveredCell?.row === rowIndex &&
                            hoveredCell?.col === colIndex &&
                            column.accessorKey in row && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <CopyIcon className="ml-2 h-4 w-4 absolute cursor-pointer" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    Copy to clipboard
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                        </div>
                      </TableCell>
                    ))}
                    {(onDelete || onDownload || onClickSendEmail) && (
                      <TableCell>
                        <div className="flex space-x-2">
                          {onDelete && (
                            <>
                              {confirmDelete === rowIndex ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setConfirmDelete(null)
                                    }}
                                  >
                                    <Cross2Icon className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onDelete(rowIndex)
                                      setConfirmDelete(null)
                                    }}
                                  >
                                    <CheckIcon className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setConfirmDelete(rowIndex)
                                  }}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              )}
                            </>
                          )}
                          {onDownload && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDownload(rowIndex)
                              }}
                            >
                              <DownloadIcon className="h-4 w-4" />
                            </Button>
                          )}
                          {onClickSendEmail && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                onClickSendEmail(row)
                              }}
                            >
                              Send Email
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between px-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Rows per page</p>
          <Select
            value={`${itemsPerPage}`}
            onValueChange={(value) => onPageChange(1, Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={itemsPerPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 60, 80].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {currentPage} of {Math.ceil(totalItems / itemsPerPage)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}