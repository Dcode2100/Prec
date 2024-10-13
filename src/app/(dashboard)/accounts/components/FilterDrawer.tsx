import React from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { FilterDateSelect } from '@/components/accountTable'
import { DatePicker } from '@/components/DatePicker'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  tempCreatedAtRange: [Date | null, Date | null]
  setTempCreatedAtRange: (range: [Date | null, Date | null]) => void
  tempExpiryDate: Date | undefined
  setTempExpiryDate: (date: Date | undefined) => void
  tempDobDate: Date | undefined
  setTempDobDate: (date: Date | undefined) => void
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  tempCreatedAtRange,
  setTempCreatedAtRange,
  tempExpiryDate,
  setTempExpiryDate,
  tempDobDate,
  setTempDobDate,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold">Filter Options</h2>
          </div>
          <div className="flex-grow overflow-y-auto p-6">
            <div className="space-y-4">
              <h4>Created Date Range</h4>
              <FilterDateSelect
                selectedDateRange={tempCreatedAtRange}
                onDateSelect={(start, end) => {
                  setTempCreatedAtRange([
                    start?.toDate() || null,
                    end?.toDate() || null,
                  ])
                }}
              />
              <div className="space-y-2 w-full">
                <h4>Expiry Date</h4>
                <DatePicker
                  className="w-full"
                  date={tempExpiryDate}
                  setDate={(date) => setTempExpiryDate(date)}
                  placeholder="Select expiry date"
                  showTime={true}
                />
              </div>
              <div className="space-y-2">
                <h4>Date of Birth</h4>
                <DatePicker
                  className="w-full"
                  date={tempDobDate}
                  setDate={(date) => setTempDobDate(date)}
                  placeholder="Select date of birth"
                />
              </div>
              <Button onClick={onApply} className="w-full">
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