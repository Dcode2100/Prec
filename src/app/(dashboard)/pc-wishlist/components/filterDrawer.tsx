'use client'

import React, { useState, useMemo } from 'react'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/DateRangePicker'
import { Label } from '@/components/ui/label'
import { DateRange } from 'react-day-picker'
import { getAssetsForPC, getTokens } from '@/lib/api/ordersApi'
import { AssetsForPC, TokenResponse } from '@/lib/types/types'
import MultiSelect from '@/components/MultiSelect'

interface CombinedFilterProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onFilterApply: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null,
    token: string[] | null
  ) => void
  tab: 'PE' | 'PC'
  disabled?: boolean
}

const CombinedFilter = ({
  open,
  onOpenChange,
  header,
  onFilterApply,
  tab,
  disabled,
}: CombinedFilterProps) => {
  const searchParams = useSearchParams()
  const [showCalInput, setShowCalInput] = useState(false)
  const [selectedDate, setSelectedDate] = useState('Anytime')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    if (startDate && endDate) {
      return {
        from: new Date(startDate),
        to: new Date(endDate),
      }
    }
    return undefined
  })

  const [selectedTokens, setSelectedTokens] = useState<string[]>([])

  const { data: tokens } = useQuery({
    queryKey: ['tokens', tab],
    queryFn: async () => {
      return tab === 'PE'
        ? (getTokens() as Promise<TokenResponse[]>)
        : getAssetsForPC().then((response) => response.assets as AssetsForPC[])
    },
    enabled: open,
  })

  // Handle date selection logic
  const windowSelect = (window: string) => {
    const [value, unit] = window.split('-')
    const start = moment().subtract(
      parseInt(value),
      unit as moment.unitOfTime.DurationConstructor
    )
    const end = moment()
    setDateRange({ from: start.toDate(), to: end.toDate() })
    setSelectedDate(`Last ${value} ${unit}`)
  }

  // Apply both date and token filter logic
  const applyFilter = () => {
    const startDate = dateRange?.from ? moment(dateRange.from) : null
    const endDate = dateRange?.to ? moment(dateRange.to) : null
    const tokens = selectedTokens.length > 0 ? selectedTokens : null

    onFilterApply(startDate, endDate, tokens)
    onOpenChange(false)
  }

  // Modify renderTokenItems
  const renderTokenItems = useMemo(() => {
    return tokens?.map((token) => ({
      label: tab === 'PE' ? token.symbol : token.name,
      value: tab === 'PE' ? token.token : token.id,
    }))
  }, [tokens, tab])

  if (!open) return null

  return (
    <Sheet open={open} onOpenChange={() => onOpenChange(false)}>
      <SheetContent side="right">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>{header}</Label>
          </div>

          {/* Date Selection Section */}
          <Select
            disabled={disabled}
            onValueChange={(value) => {
              if (value === 'range') {
                setShowCalInput(true)
                setSelectedDate('Range')
              } else {
                setShowCalInput(false)
                if (value === 'anytime') {
                  setDateRange(undefined)
                  setSelectedDate('Anytime')
                } else {
                  windowSelect(value)
                }
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedDate} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anytime">Anytime</SelectItem>
              <SelectItem value="24-hours">Last 24 Hours</SelectItem>
              <SelectItem value="7-days">Last 7 Days</SelectItem>
              <SelectItem value="14-days">Last 14 Days</SelectItem>
              <SelectItem value="30-days">Last 30 Days</SelectItem>
              <SelectItem value="range">Select Range</SelectItem>
            </SelectContent>
          </Select>

          {showCalInput && (
            <DateRangePicker
              className="w-full"
              date={dateRange}
              onDateChange={(range: DateRange | undefined) => {
                setDateRange(range || undefined)
              }}
            />
          )}

          {/* Token Selection Section */}
          {renderTokenItems && (
            <MultiSelect
              onFilterChange={setSelectedTokens}
              filters={renderTokenItems}
              label="Assets"
              selectedFilters={selectedTokens}
            />
          )}

          <Button onClick={applyFilter} className="w-full">
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default CombinedFilter
