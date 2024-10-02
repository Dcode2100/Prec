import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { CSVLink } from 'react-csv'
import { privateEquityHeaders } from '@/constants/headers'
import { assetsPeResponse } from '@/lib/types/types'
import UploadBulkAsset from './bulk-upload'
import moment from 'moment'
import { PlusIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  data: assetsPeResponse[]
}

export function DataTableViewOptions<TData>({
  table,
  data,
}: DataTableViewOptionsProps<TData>) {
  const router = useRouter()
  return (
    <div className="flex items-center gap-2">
      <CSVLink
        data={data}
        headers={privateEquityHeaders}
        filename={`PrivateEquityData_${moment(new Date()).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}.csv`}
      >
        <Button variant="outline" size="sm" className="ml-auto h-8">
          Export CSV
        </Button>
      </CSVLink>
      <UploadBulkAsset />
      <Button
        variant="outline"
        size="sm"
        className="ml-auto h-8 items-center"
        onClick={() => router.push('/privateequity/create-asset')}
      >
        <PlusIcon className="mr-1 h-3 w-4" />
        Create Asset
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="ml-auto hidden h-8 lg:flex"
          >
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
