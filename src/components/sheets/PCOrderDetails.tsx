import React, { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { updatePCOrderStatusById, getPCOrdersById } from '@/lib/api/ordersApi'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useQuery } from '@tanstack/react-query'
import { CopyIcon } from 'lucide-react'
import RefundModalPC from '@/components/modals/RefundModalPC'

interface PCOrderDetailsProps {
  isOpen: boolean
  onClose: () => void
  order_id: string
  setLoading?: (loading: boolean) => void
  order: any
  dataUpdate: boolean
  setDataUpdate: (update: boolean) => void
}

const PCOrderDetails: React.FC<PCOrderDetailsProps> = ({
  isOpen,
  onClose,
  order_id,
  order,
  dataUpdate,
  setDataUpdate,
}) => {
  const { toast } = useToast()
  const [status, setStatus] = useState(order?.status || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false)
  const orderDetailsQuery = useQuery({
    queryKey: ['pc_order_details', order_id, dataUpdate],
    queryFn: () => getPCOrdersById(order_id),
  })

  const handleStatusChange = async () => {
    setIsUpdating(true)
    try {
      await updatePCOrderStatusById({ orderId: order?.id, status })
      toast({
        title: 'Success',
        description: 'Order status updated successfully',
      })
      setDataUpdate(!dataUpdate)
      onClose()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value)
    toast({
      description: 'Value copied to clipboard',
      duration: 1500,
    })
  }

  const DetailRow = ({ label, value, copyable = false }: { label: string, value: string, copyable?: boolean }) => (
    <div className="py-1 flex justify-between items-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center">
        <span className="text-base font-semibold text-right">
          {value || '-'}
        </span>
        {copyable && (
          <CopyIcon
            className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(value)}
          />
        )}
      </div>
    </div>
  )

  const orderContent = orderDetailsQuery.isLoading ? (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-8 w-full" />
      ))}
    </div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-1">
        <DetailRow
          label="Order ID"
          value={orderDetailsQuery.data?.gui_id}
          copyable
        />
        <DetailRow
          label="Order UUID"
          value={orderDetailsQuery.data?.id}
          copyable
        />
        <DetailRow
          label="Account ID"
          value={orderDetailsQuery.data?.gui_account_id}
          copyable
        />
        <DetailRow
          label="Account Name"
          value={
            <Badge variant="outline" className="ml-2">
              {`${orderDetailsQuery.data?.first_name} ${orderDetailsQuery.data?.last_name}`}
            </Badge>
          }
        />
        <DetailRow
          label="Account Email"
          value={orderDetailsQuery.data?.email}
          copyable
        />
        <DetailRow
          label="Mobile"
          value={orderDetailsQuery.data?.mobile}
          copyable
        />
      </div>
      <Separator className="my-4" />
      <div className="space-y-1">
        <DetailRow label="Symbol" value={orderDetailsQuery.data?.symbol} />
        <DetailRow label="Price" value={`₹ ${orderDetailsQuery.data?.price}`} />
        <DetailRow
          label="Quantity"
          value={orderDetailsQuery.data?.quantity?.toString()}
        />
        <DetailRow
          label="Total Investment"
          value={`₹ ${orderDetailsQuery.data?.subscription_amount}`}
        />
        {orderDetailsQuery.data?.transaction_fees && (
          <DetailRow
            label="Transaction Fee"
            value={`₹ ${orderDetailsQuery.data?.transaction_fees}`}
          />
        )}
        {orderDetailsQuery.data?.gst && (
          <DetailRow label="GST" value={`₹ ${orderDetailsQuery.data?.gst}`} />
        )}
        <DetailRow label="Coins Used" value={orderDetailsQuery.data?.coins} />
        <DetailRow
          label="Total Purchase Value"
          value={`₹ ${(+orderDetailsQuery.data?.amount).toFixed(2)}`}
        />
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="status" className="text-sm text-muted-foreground">
            Status
          </Label>
          <Select onValueChange={setStatus} value={status}>
            <SelectTrigger id="status" className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SUBSCRIPTION_PROCESSED">
                Subscription processed
              </SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
              <SelectItem value="PAYMENT_PENDING">Payment pending</SelectItem>
              <SelectItem value="SUBSCRIPTION_PROCESSING">
                Subscription processing
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex justify-end space-x-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setIsRefundModalOpen(true)}
            disabled={
              !(
                status === 'SUBSCRIPTION_PROCESSED' ||
                status === 'SUBSCRIPTION_PROCESSING'
              )
            }
          >
            Refund
          </Button>
          <Button
            variant="default"
            disabled={isUpdating}
            onClick={handleStatusChange}
          >
            Update Status
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="min-w-[600px]">
          <SheetHeader>
            <SheetTitle>PC Order Details</SheetTitle>
            <SheetDescription>View and update order details</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">{orderContent}</div>
        </SheetContent>
      </Sheet>
      <RefundModalPC
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        order_id={order_id}
        transactionAmount={orderDetailsQuery.data?.amount || 0}
        isProcessed={status === 'SUBSCRIPTION_PROCESSED'}
        dataUpdate={dataUpdate}
        setDataUpdate={setDataUpdate}
      />
    </>
  )
}

export default PCOrderDetails
