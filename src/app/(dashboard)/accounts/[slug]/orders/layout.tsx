'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import CreateManualOrderModal from '@/components/sheets/CreateManualOrderDrawer'
import CreatePCManualOrderModal from '@/components/sheets/CreatePCManualOrderDrawer'
import { useParams, usePathname } from 'next/navigation'

const Layout = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const params = useParams()
  const pathname = usePathname()

  const handleToggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen)
  }
  const accountId = (params.slug as string).split('-').slice(1).join('-')
  const showCreateOrderButton = pathname.includes('/orders')

  return (
    <div className="flex justify-between relative flex-col">
      {showCreateOrderButton && (
        <Button
          variant="default"
          className="absolute right-0 top-0"
          onClick={handleToggleDrawer}
        >
          Create Order
        </Button>
      )}

      {isDrawerOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg z-50 flex flex-col">
          <div className="flex-shrink-0 p-4 border-b">
            <h2 className="text-lg font-semibold">Create Order</h2>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleToggleDrawer}
            >
              Close
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto">
            {pathname.includes('/orders/peOrders') ||
            pathname.includes('/orders/pcOrders/sell') ? (
              <CreateManualOrderModal
                isOpen={isDrawerOpen}
                onClose={handleToggleDrawer}
                accountId={accountId}
              />
            ) : pathname.includes('/orders/pcOrders') ? (
              <CreatePCManualOrderModal
                isOpen={isDrawerOpen}
                onClose={handleToggleDrawer}
                accountId={accountId}
                coinBalance={0}
              />
            ) : null}
          </div>
        </div>
      )}

      {children}
    </div>
  )
}

export default Layout
