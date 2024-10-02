import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import React, { useState, useCallback } from 'react'
import { debounce } from 'lodash'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { tokenTypes } from '../data/data'
import { assetsPeResponse } from '@/lib/types/types'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  fetchedAssets: assetsPeResponse[]
  search: string
  onSearchChange: (value: string) => void
  accountType: string
  onAccountTypeChange: (value: string) => void
}

export function DataTableToolbar<TData>({
  table,
  fetchedAssets,
  search,
  onSearchChange,
  accountType,
  onAccountTypeChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [searchValue, setSearchValue] = useState(search)

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      onSearchChange(value)
    }, 1000),
    [onSearchChange]
  )

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
    debouncedSearch(event.target.value)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearchChange(searchValue)
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search Accounts"
          value={searchValue}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        <Select value={accountType} onValueChange={onAccountTypeChange}>
          <SelectTrigger className="h-8 w-[180px]">
            <SelectValue placeholder="Select account type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            {tokenTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} data={fetchedAssets} />
    </div>
  )
}
