import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import moment from 'moment'
import { capitalize } from '@/utils/helper'
import { getPCOrdersById, updatePCOrderStatusById } from '@/lib/api/ordersApi'
import { getGlobalItem } from '@/utils/utils'

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { CopyButton } from '@/components/CopyButton'
import RefundModal from './PCRefundModal'

interface OrderDetailsProps {
  isOpen: boolean
  onClose: () => void
  order_id: string
  setLoading: (loading: boolean) => void
  page?: string
  refetch: () => void
}

interface PCOrderStatusType {
  PAYMENT_PENDING: string
  SUBSCRIPTION_PROCESSING: string
  SUBSCRIPTION_PROCESSED: string
  FAILED: string
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  isOpen,
  onClose,
  order_id,
  setLoading,
  refetch,
}) => {
  const { toast } = useToast()
  const [updateSelectedStatus, setUpdateSelectedStatus] = useState('')
  const [openRefund, setOpenRefund] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const isAffiliate = getGlobalItem('isAffiliate')
  const getPCOrderDetails = async () => {
    const response = await getPCOrdersById(order_id)
    return response
  }
  const { data: order, isLoading } = useQuery({
    queryKey: ['pc-order-details', order_id],
    queryFn: getPCOrderDetails,
  })

  const PeOrderStatus: PCOrderStatusType = {
    SUBSCRIPTION_PROCESSED: 'Subscription processed',
    FAILED: 'Failed',
    PAYMENT_PENDING: 'Payment pending',
    SUBSCRIPTION_PROCESSING: 'Subscription processing',
  }

  const copyDetail = (label: string, value: string | undefined) => (
    <div className="flex justify-between items-center" key={label}>
      <span className="text-sm text-muted-foreground">{label}:</span>
      <CopyButton
        value={value || ''}
        isTruncated
        iconSide="left"
        className="max-w-[60%] justify-end"
      />
    </div>
  )

  const renderDetail = (
    label: string,
    value: React.ReactNode,
    statusColor?: string
  ) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className={`font-medium ${statusColor}`}>{value || '-'}</span>
    </div>
  )

  const renderDateDetail = (label: string, date?: string) => (
    <div className="flex justify-between items-center py-2">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <div className="text-right">
        <span className="text-xs opacity-60 mr-2">
          {date ? moment(date).format('hh:mm a') : ''}
        </span>
        <span className="font-medium">
          {date ? moment(date).format('MM.DD.YYYY') : '-'}
        </span>
      </div>
    </div>
  )

  const updateStatus = async () => {
    setIsUpdating(true)
    try {
      const response = await updatePCOrderStatusById({
        orderId: order?.id,
        status: updateSelectedStatus,
      })

      if (response.status) {
        toast({
          title: 'PC Order Status Updated Successfully',
          description: 'The order status has been updated.',
        })
        refetch()
        onClose()
      }
    } catch (error) {
      toast({
        title: 'Error updating status',
        description: 'An error occurred while updating the order status.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
      setLoading(false)
    }
  }

  const getDrawerContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 opacity-50 mt-20 mx-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      )
    }

    if (!order) {
      return <div className="mt-4">No order data available.</div>
    }

    const totalPurchaseValue = +order.amount

    return (
      <>
        <SheetHeader>
          <SheetTitle>PC Order Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {copyDetail('Order ID', order.gui_id)}
          {copyDetail('Order UUID', order.id)}
          {copyDetail('Account ID', order.gui_account_id)}
          {renderDetail(
            'Account Name',
            <Link
              href={`/accounts/PE/${order.user_id}`}
              className="bg-yellow-400 px-2 py-1 text-gray-900 rounded"
            >
              {capitalize(`${order.first_name} ${order.last_name}`)}
            </Link>
          )}
          {copyDetail('Account Email', order.email)}
          {copyDetail('Mobile', order.mobile)}

          <Separator />

          {renderDetail('Symbol', order.symbol)}
          {renderDetail('Price', order.price)}
          {renderDetail('Quantity', order.quantity?.toString())}
          {renderDetail('Total Investment', `₹ ${order.subscription_amount}`)}
          {order.transaction_fees &&
            renderDetail('Transaction Fee', `₹ ${order.transaction_fees}`)}
          {order.gst && renderDetail('GST', `₹ ${order.gst}`)}
          {renderDetail('Coins Used', order.coins)}
          {renderDetail(
            'Total Purchase Value',
            `₹ ${totalPurchaseValue.toFixed(2)}`
          )}

          <Separator className={isAffiliate ? 'hidden' : ''} />

          {!isAffiliate && (
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              <Select
                value={updateSelectedStatus || order.status}
                onValueChange={(value) => setUpdateSelectedStatus(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PeOrderStatus).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {renderDateDetail('Created At', order.created_at)}
          {renderDateDetail('Updated At', order.updated_at)}

          {!isAffiliate && (
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setOpenRefund(true)}
                disabled={
                  isUpdating ||
                  !(
                    order.status === 'SUBSCRIPTION_PROCESSED' ||
                    order.status === 'SUBSCRIPTION_PROCESSING'
                  )
                }
              >
                Refund
              </Button>
              <Button onClick={updateStatus} disabled={isUpdating}>
                {isUpdating ? 'Updating...' : 'Update Status'}
              </Button>
            </div>
          )}
        </div>
      </>
    )
  }

  return (
    <>
      {openRefund && (
        <RefundModal
          openRefundModal={openRefund}
          setOpenRefundModal={setOpenRefund}
          order_id={order?.id}
          transactionAmount={order?.amount}
          isProcessed={order?.status === 'SUBSCRIPTION_PROCESSED'}
          refetch={refetch}
        />
      )}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md">
          {getDrawerContent()}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default OrderDetails
