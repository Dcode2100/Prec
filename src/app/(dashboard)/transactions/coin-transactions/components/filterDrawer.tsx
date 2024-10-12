'use client'

import { useState } from 'react'
import moment from 'moment'
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
import { DateRange } from 'react-day-picker'
import { FilterNumber } from '@/components/accountTable'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onApplyFilter: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null,
    direction: string,
    status: string[],
    amountRange: [number | null, number | null]
  ) => void
  disabled?: boolean
}

const FilterDrawer = ({
  open,
  onOpenChange,
  header,
  onApplyFilter,
  disabled,
}: FilterDrawerProps) => {
  const [showCalInput, setShowCalInput] = useState(false)
  const [selected, setSelected] = useState('Anytime')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [directionFilter, setDirectionFilter] = useState<string>('All')
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [amountRange, setAmountRange] = useState<
    [number | null, number | null]
  >([null, null])

  const windowSelect = (window: string) => {
    const [value, unit] = window.split('-')
    const start = moment().subtract(
      parseInt(value),
      unit as moment.unitOfTime.DurationConstructor
    )
    const end = moment()
    setDateRange({ from: start.toDate(), to: end.toDate() })
    setSelected(`Last ${value} ${unit}`)
  }

  const applyFilter = () => {
    if (dateRange?.from && dateRange?.to) {
      onApplyFilter(
        moment(dateRange.from),
        moment(dateRange.to),
        directionFilter,
        statusFilters,
        amountRange
      )
    } else {
      onApplyFilter(null, null, directionFilter, statusFilters, amountRange)
    }
    onOpenChange(false)
  }
  if (!open) return null
  return (
    <Sheet open={open} onOpenChange={() => onOpenChange(false)}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">{header}</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="space-y-4">
              <Select
                disabled={disabled}
                onValueChange={(value) => {
                  if (value === 'range') {
                    setShowCalInput(true)
                    setSelected('Range')
                  } else {
                    setShowCalInput(false)
                    if (value === 'anytime') {
                      setDateRange(undefined)
                      setSelected('Anytime')
                    } else {
                      windowSelect(value)
                    }
                  }
                }}
              >
                <FilterNumber
                  header="Coins Range"
                  onChange={setAmountRange}
                  minRange={0}
                  maxRange={10000}
                  step={1}
                />
                <div className="flex flex-col space-y-2">
                  <h2 className="text-sm">Date</h2>
                  <SelectTrigger>
                    <SelectValue placeholder={selected} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anytime">Anytime</SelectItem>
                    <SelectItem value="24-hours">Last 24 Hours</SelectItem>
                    <SelectItem value="7-days">Last 7 Days</SelectItem>
                    <SelectItem value="14-days">Last 14 Days</SelectItem>
                    <SelectItem value="30-days">Last 30 Days</SelectItem>
                    <SelectItem value="range">Select Range</SelectItem>
                  </SelectContent>
                </div>
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
              <div className="flex flex-col space-y-2">
                <h2 className="text-sm">Status</h2>
                <Select
                  value={directionFilter}
                  onValueChange={(value) => setDirectionFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Credit">Credit</SelectItem>
                    <SelectItem value="Debit">Debit</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={applyFilter} className="w-full">
                Apply Filter
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
export default FilterDrawer
