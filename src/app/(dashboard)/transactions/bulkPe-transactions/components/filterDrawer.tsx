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
import { Label } from '@/components/ui/label'
import { DateRange } from 'react-day-picker'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface FilterDateSelectProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onApplyFilter: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null,
    status: string,
    paymentMode: string,
    type: string,
    dateFilterType: string
  ) => void
  disabled?: boolean
}

const FilterDateSelect = ({
  open,
  onOpenChange,
  header,
  onApplyFilter,
  disabled,
}: FilterDateSelectProps) => {
  const [showCalInput, setShowCalInput] = useState(false)
  const [selected, setSelected] = useState('Anytime')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const status = 'All'
  const paymentMode = 'All'
  const type = 'All'
  const [dateFilterType, setDateFilterType] = useState<string>('createdAt')

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
        status,
        paymentMode,
        type,
        dateFilterType
      )
    } else {
      onApplyFilter(
        null,
        null,
        status,
        paymentMode,
        type,
        dateFilterType
      )
    }
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <Sheet open={open} onOpenChange={() => onOpenChange(false)}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>{header}</Label>
          </div>
          
          <RadioGroup
            value={dateFilterType}
            onValueChange={setDateFilterType}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="createdAt" id="createdAt" />
              <Label htmlFor="createdAt">Created At</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="updatedAt" id="updatedAt" />
              <Label htmlFor="updatedAt">Updated At</Label>
            </div>
          </RadioGroup>

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
            <SelectTrigger className="w-full">
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
          <Button onClick={applyFilter} className="w-full">
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterDateSelect