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
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface FilterDrawerProps {
  open: boolean
  onOpenChange: (value: boolean) => void
  header: string
  onApplyFilter: (
    amountRange: [number | null, number | null],
    status: string[],
    startDate: moment.Moment | null,
    endDate: moment.Moment | null
  ) => void
  statusOptions: string[]
}

const FilterDrawer = ({
  open,
  onOpenChange,
  header,
  onApplyFilter,
  statusOptions,
}: FilterDrawerProps) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [amountRange, setAmountRange] = useState<
    [number | null, number | null]
  >([null, null])
  const [status, setStatus] = useState<string[]>([])

  const applyFilter = () => {
    const startDate = dateRange?.from ? moment(dateRange.from) : null
    const endDate = dateRange?.to ? moment(dateRange.to) : null
    onApplyFilter(amountRange, status, startDate, endDate)
    onOpenChange(false)
  }

  if (!open) return null
  return (
    <Sheet open={open} onOpenChange={() => onOpenChange(false)}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">{header}</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="space-y-6">
              <div>
                <Label>Amount Range</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <Input
                    type="number"
                    value={amountRange[0] || 0}
                    onChange={(e) =>
                      setAmountRange([parseInt(e.target.value), amountRange[1]])
                    }
                    className="w-full"
                  />
                  <span>to</span>
                  <Input
                    type="number"
                    value={amountRange[1] || 0}
                    onChange={(e) =>
                      setAmountRange([amountRange[0], parseInt(e.target.value)])
                    }
                    className="w-full"
                  />
                </div>
                <Slider
                  min={0}
                  max={10000000}
                  step={1000}
                  value={amountRange as [number, number]}
                  onValueChange={(value) =>
                    setAmountRange(value as [number, number])
                  }
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Status</Label>
                <Select
                  value={status[0]}
                  onValueChange={(value) => setStatus([value])}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Created At</Label>
                <DateRangePicker
                  className="w-full mt-2"
                  date={dateRange}
                  onDateChange={setDateRange}
                />
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
