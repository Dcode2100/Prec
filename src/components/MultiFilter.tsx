'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Search, X, RefreshCw, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import debounce from 'lodash/debounce'

interface FilterItem {
  label: string
  value: string
  count?: number
}

interface FilterPopoverProps {
  label: string
  filters: FilterItem[]
  onFilterChange?: (selectedValues: string[]) => void
}

const MultiFilter: React.FC<FilterPopoverProps> = ({
  label,
  filters,
  onFilterChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    return filters.filter((filter) =>
      filter.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [filters, searchQuery])

  const debouncedOnFilterChange = useCallback(
    debounce((newSelectedValues: string[]) => {
      onFilterChange?.(newSelectedValues)
    }, 300),
    [onFilterChange]
  )

  const resetFilters = useCallback(() => {
    setSelectedValues([])
    debouncedOnFilterChange([])
    setOpen(false)
  }, [debouncedOnFilterChange])

  const toggleFilter = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    setSelectedValues(newSelectedValues)
    debouncedOnFilterChange(newSelectedValues)
  }

  return (
    <div className="flex flex-row-reverse items-end gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="h-10 justify-between max-w-content h-8 bg-background"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {selectedValues.length > 0
                  ? `${selectedValues.length} ${label}`
                  : label}
              </span>
            </div>
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200 text-muted-foreground',
                open ? 'rotate-180' : ''
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px]  p-0" align="end">
          <div className="p-2 border-b">
            <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-secondary">
              <Search className="w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Search ${label}...`}
                className="h-8 shadow-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="p-2 overflow-auto h-[250px]">
            {filteredItems.length === 0 ? (
              <p className="text-sm text-muted-foreground p-2">
                No topics found
              </p>
            ) : (
              <div className="gap-2 flex flex-wrap">
                {filteredItems.map((filter) => (
                  <div
                    key={filter.value}
                    onClick={() => toggleFilter(filter.value)}
                    className={cn(
                      'flex items-center justify-between rounded-full px-3 py-1.5 cursor-pointer text-xs transition-colors',
                      selectedValues.includes(filter.value)
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-secondary/80 bg-secondary/50 text-secondary-foreground'
                    )}
                  >
                    <span className="mr-1">{filter.label}</span>
                    {filter.count && filter.count > 0 && (
                      <span className="text-xs opacity-70">{`(${filter.count})`}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {selectedValues.length > 0 && (
            <div className="p-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MultiFilter
