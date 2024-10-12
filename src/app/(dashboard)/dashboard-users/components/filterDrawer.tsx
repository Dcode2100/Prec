'use client'

import React, { useState } from 'react'
import moment from 'moment'
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

interface FilterDateSelectProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onApplyFilter: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null,
    verified: string
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
  const searchParams = useSearchParams()
  const [showCalInput, setShowCalInput] = useState(false)
  const [selected, setSelected] = useState('Anytime')
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
  const [verified, setVerified] = useState<string>('all')

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
      onApplyFilter(moment(dateRange.from), moment(dateRange.to), verified)
    } else {
      onApplyFilter(null, null, verified)
    }
    onOpenChange(false)
  }

  if (!open) return null

  return (
    <Sheet open={open} onOpenChange={() => onOpenChange(false)}>
      <SheetContent side="right">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>{header}</Label>
          </div>
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
          <Select
            value={verified}
            onValueChange={(value) => setVerified(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Callback Data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Verified</SelectItem>
              <SelectItem value="false">Unverified</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={applyFilter} className="w-full">
            Apply Filter
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default FilterDateSelect
