import React, { useState, useMemo, useCallback, useRef } from 'react'
import { X, RefreshCw, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import debounce from 'lodash/debounce'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface FilterItem {
  label: string
  value: string
  count?: number
}

interface FilterProps {
  label: string
  filters: FilterItem[]
  selectedFilters: string[]
  onFilterChange?: (selectedValues: string[]) => void
}

const MultiFilter: React.FC<FilterProps> = ({
  label,
  filters,
  selectedFilters,
  onFilterChange,
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(
    selectedFilters || []
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

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
  }, [debouncedOnFilterChange])

  const toggleFilter = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]

    setSelectedValues(newSelectedValues)
    debouncedOnFilterChange(newSelectedValues)
  }

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newQuery = e.target.value
      setSearchQuery(newQuery)
      if (newQuery && !isOpen) {
        setIsOpen(true)
      }
    },
    [isOpen]
  )

  return (
    <div className="w-full max-w-[300px]">
      <Popover open={isOpen} modal={true} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div
            className="flex flex-wrap items-center gap-2 p-2 border rounded-md cursor-text min-h-[40px]"
            onClick={() => inputRef.current?.focus()}
          >
            {selectedValues.length > 0 ? (
              selectedValues.map((value) => {
                const filter = filters.find((f) => f.value === value)
                return (
                  <div
                    key={value}
                    className="flex items-center bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs"
                  >
                    <span>{filter?.label}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleFilter(value)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })
            ) : (
              <span className="text-xs text-muted-foreground">
                {`Add ${label}`}
              </span>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start" sideOffset={5}>
          <div className="flex flex-col h-[350px]">
            <div className="p-2 border-b bg-background">
              <Input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={`Search ${label}...`}
                className="w-full text-xs"
              />
            </div>
            <div className="flex flex-col flex-1">
              <h3 className="text-sm text-center font-medium p-2 bg-background border-b">
                Available {label}
              </h3>
              <div className="px-2 h-[200px] overflow-auto">
                {filteredItems.map((filter) => (
                  <div
                    key={filter.value}
                    className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 p-1.5 rounded-sm"
                    onClick={() => toggleFilter(filter.value)}
                  >
                    <div className="w-4 h-4 flex items-center justify-center">
                      {selectedValues.includes(filter.value) && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <span className="text-sm flex-grow">{filter.label}</span>
                    {filter.count && filter.count > 0 ? (
                      <span className="text-xs text-muted-foreground">{`(${filter.count})`}</span>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-2 border-t bg-background">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="w-full"
                disabled={selectedValues.length === 0}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default MultiFilter
