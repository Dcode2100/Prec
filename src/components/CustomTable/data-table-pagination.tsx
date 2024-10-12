import { Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEffect } from 'react'

interface DataTablePaginationProps<TData> {
  table: Table<TData>
  page: number
  limit: number
  onPageChange: (page: number) => void
  onRowChange: (limit: number) => void
  total: number
}

export function DataTablePagination<TData>({
  table,
  page,
  limit,
  onPageChange,
  onRowChange,
  total,
}: DataTablePaginationProps<TData>) {
  useEffect(() => {
    table.setPageSize(limit)
  }, [limit, table])

  useEffect(() => {
    table.setPageIndex(page - 1)
  }, [page, table])

  const totalPages = Math.ceil(total / limit)
  return (
    <div className="flex items-center justify-between px-2">
      <div className="hidden flex-1 text-sm text-muted-foreground sm:block"></div>
      <div className="flex items-center sm:space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="hidden text-sm font-medium sm:block">Rows per page</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              onRowChange(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {generatePageSizes(total).map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

// Add this function at the end of the file, outside of the component
function generatePageSizes(total: number): number[] {
  const pageSizes = [10]
  let current = 10
  const upperLimit = Math.min(total, 1000)

  while (current < upperLimit) {
    if (current < 100) {
      current += 10
    } else {
      current = Math.min(current * 2, upperLimit)
    }

    if (current > 100) {
      current = Math.ceil(current / 100) * 100
    }

    if (!pageSizes.includes(current) && current <= upperLimit) {
      pageSizes.push(current)
    }
  }

  if (!pageSizes.includes(upperLimit)) {
    pageSizes.push(upperLimit)
  }

  return pageSizes
}
