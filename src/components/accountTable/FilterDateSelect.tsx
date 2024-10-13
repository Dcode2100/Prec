'use client'
import React, { useState, useEffect } from 'react'
import moment from 'moment'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/DateRangePicker'
import { DateRange } from 'react-day-picker'

interface FilterDateSelectProps {
  onDateSelect: (
    startDate: moment.Moment | null,
    endDate: moment.Moment | null
  ) => void
  disabled?: boolean
  selectedDateRange?: [Date | null, Date | null]
}

const FilterDateSelect = ({
  selectedDateRange,
  onDateSelect,
  disabled,
}: FilterDateSelectProps) => {
  const [showCalInput, setShowCalInput] = useState(false)
  const [selected, setSelected] = useState('Anytime')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(
    selectedDateRange
      ? {
          from: selectedDateRange[0]
            ? new Date(selectedDateRange[0])
            : undefined,
          to: selectedDateRange[1] ? new Date(selectedDateRange[1]) : undefined,
        }
      : undefined
  )

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      setSelected(
        `${moment(dateRange.from).format('MMM D, YYYY')} - ${moment(
          dateRange.to
        ).format('MMM D, YYYY')}`
      )
    }
  }, [dateRange])

  const windowSelect = (window: string) => {
    const [value, unit] = window.split('-')
    const start = moment().subtract(
      parseInt(value),
      unit as moment.unitOfTime.DurationConstructor
    )
    const end = moment()
    setDateRange({ from: start.toDate(), to: end.toDate() })
    setSelected(`Last ${value} ${unit}`)
    onDateSelect(start, end)
  }

  return (
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
              onDateSelect(null, null)
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
            setDateRange(range)
            if (range?.from && range?.to) {
              onDateSelect(moment(range.from), moment(range.to))
            }
          }}
        />
      )}
    </div>
  )
}

export default FilterDateSelect
