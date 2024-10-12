import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet'

interface FilterDrawerProps {
  isOpen: boolean
  onClose: () => void
  onApply: () => void
  children: React.ReactNode
}

const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  onApply,
  children,
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Options</SheetTitle>
          <SheetDescription>
            Apply filters to refine your results.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 flex flex-col gap-4">{children}</div>
        <SheetFooter>
          <div className="flex justify-end mt-6">
            <Button onClick={onClose} variant="outline" className="mr-2">
              Cancel
            </Button>
            <Button
              onClick={() => {
                onApply()
                onClose()
              }}
            >
              Apply Filters
            </Button>
          </div>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default FilterDrawer
