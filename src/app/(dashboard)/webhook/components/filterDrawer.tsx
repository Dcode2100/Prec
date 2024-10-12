'use client'

import React, { useEffect, useState } from 'react'
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

interface FilterDateSelectProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onDateSelect: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null
  ) => void
  disabled?: boolean
  status: string | null
  direction: string | null
  onStatusSelect: (status: string | null) => void
  onDirectionSelect: (direction: string | null) => void
}

const FilterDateSelect = ({
  open,
  onOpenChange,
  header,
  onDateSelect,
  disabled,
  status,
  direction,
  onStatusSelect,
  onDirectionSelect,
}: FilterDateSelectProps) => {
  const [showCalInput, setShowCalInput] = useState(false)
  const [selected, setSelected] = useState('Anytime')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(status)
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    direction
  )
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [dateSelect, setDateSelect] = useState<string>('anytime')

  useEffect(() => {
    setSelectedStatus(status || 'all')
    setSelectedDirection(direction || 'all')
  }, [status, direction])

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
      onDateSelect(moment(dateRange.from), moment(dateRange.to))
    } else {
      onDateSelect(null, null)
    }
    onStatusSelect(selectedStatus)
    onDirectionSelect(selectedDirection)
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
            value={dateSelect}
            onValueChange={(value) => {
              setDateSelect(value)
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
          <Label>Status</Label>
          <Select
            value={selectedStatus || 'all'}
            onValueChange={(value) => setSelectedStatus(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="SUCCESS">Success</SelectItem>
              <SelectItem value="FAILED">Fail</SelectItem>
            </SelectContent>
          </Select>

          <Label>Direction</Label>
          <Select
            value={selectedDirection || 'all'}
            onValueChange={(value) => setSelectedDirection(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Direction" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="debit">Debit</SelectItem>
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
