import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import moment from 'moment'
import { Formik, Form, Field } from 'formik'
import { cn } from '@/lib/utils'
import { capitalize } from '@/utils/helper'
import { getOrdersById, updateOrderStatusById, updateOrderById } from '@/lib/api/ordersApi'
import { uploadPdf } from '@/lib/api/mediaHandlerApi'
import { usePathname } from 'next/navigation'

import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import Invoice from '@/components/Invoice'
import NSEInvoice from '@/components/NSEInvoice'
import { CopyButton } from '@/components/CopyButton'
import RefundModal from '@/components/modals/RefundModalPE'

const copyDetail = (label: string, value: string | undefined) => (
  <div className="flex justify-between items-center " key={label}>
    <span className="text-sm text-muted-foreground">{label}:</span>
    <CopyButton
      value={value || ''}
      isTruncated
      iconSide="left"
      className="max-w-[60%] justify-end"
    />
  </div>
)

interface OrderDetailsProps {
  orderId: string
  isOpen: boolean
  onClose: () => void
  page?: string
  isAffiliate?: boolean
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  isOpen,
  onClose,
  page,
  isAffiliate = false,
}) => {
  const { toast } = useToast()
  const pathname = usePathname()
  const [isUpdating, setIsUpdating] = useState(false)
  const [isOpenRefundModal, setIsOpenRefundModal] = useState(false)

  const {
    data: order,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrdersById(orderId, 'PE'),
    enabled: isOpen,
  })

  const transferable = order?.data?.transferable

  const PeOrderStatus = useMemo(() => {
    if (!transferable) {
      return {
        VERIFICATION_PENDING: 'Verification Pending',
        SIGN_AGREEMENT: 'Sign Agreement',
        ADD_IDENTITY_DETAILS: 'Add Identity Details',
        CONFIRM_IDENTITY_DETAILS: 'Confirm Identity Details',
        LOCKED: 'Locked',
        TRANSFER_PENDING: 'Transfer Pending',
        INVALID: 'Invalid',
        SUCCESS: 'Completed',
      }
    } else {
      return {
        SUCCESS: 'Completed',
        TRANSFER_PENDING: 'Transfer Pending',
        INVALID: 'Invalid',
      }
    }
  }, [transferable])

  const handleSubmit = async (values: {
    status: string
    note: string
    boId: string
  }) => {
    setIsUpdating(true)
    try {
      if (values.status !== order?.data?.status) {
        await updateOrderStatusById('PE', orderId, values.status, '')
      }
      if (
        values.note !== order?.data?.note ||
        values.boId !== order?.data?.bo_id
      ) {
        await updateOrderById(orderId, { note: values.note, boId: values.boId })
      }
      toast({
        title: 'Order updated successfully',
        description: 'The order details have been updated.',
      })
      onClose()
    } catch (error) {
      toast({
        title: 'Error updating order',
        description: 'An error occurred while updating the order.',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('signAgreement', file)
        formData.append('fileType', 'application/pdf')
        await uploadPdf(orderId, formData)
        toast({
          title: 'PDF uploaded successfully',
          description: 'The signed agreement has been uploaded.',
        })
      } catch (error) {
        toast({
          title: 'Error uploading PDF',
          description: 'An error occurred while uploading the PDF.',
          variant: 'destructive',
        })
      }
    }
  }

  const renderDetail = (
    label: string,
    value: React.ReactNode,
    statusColor?: string
  ) => (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm text-muted-foreground">{label}:</span>
      <span className={cn('font-medium', statusColor)}>{value || '-'}</span>
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

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <RefundModal
        openRefundModal={isOpenRefundModal}
        setOpenRefundModal={setIsOpenRefundModal}
        order_id={orderId}
        transactionAmount={+order?.data?.purchase_value}
        refetch={refetch}
        onClose={onClose}
      />
      <SheetContent className="min-w-[500px]">
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>
        {isLoading ? (
          <div className="space-y-4 mt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10" />
            ))}
          </div>
        ) : order ? (
          <Formik
            initialValues={{
              status: order?.data?.status || '',
              note: order?.data?.note || '',
              boId: order?.data?.bo_id || '',
            }}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-4 mt-4">
                {copyDetail('Order ID', order?.data?.gui_order_id)}
                {copyDetail('Order UUID', order?.data?.order_id)}
                {copyDetail('Account ID', order?.data?.gui_account_id)}
                {renderDetail(
                  'Account Name',
                  <Link
                    href={`/accounts/PE/${order?.data?.account_id}`}
                    className="bg-yellow-400 px-2 py-1 text-gray-900 rounded"
                  >
                    {capitalize(
                      order?.data?.side === 'Sell'
                        ? order?.data?.contact_person
                        : order?.data?.name
                    )}
                  </Link>
                )}
                {copyDetail('Account Email', order?.data?.email)}
                {copyDetail('Demat Account Number', order?.data?.bo_id)}
                {copyDetail('Mobile', order?.data?.mobile)}

                {pathname === '/delivery-journey' && (
                  <>
                    <Separator />
                    {renderDetail(
                      'Account Number',
                      order?.data?.bank_details[0]?.account_number
                    )}
                    {renderDetail(
                      'IFSC Code',
                      order?.data?.bank_details[0]?.ifsc
                    )}
                    {renderDetail(
                      'Bank Name',
                      order?.data?.bank_details[0]?.bank_name
                    )}
                    {renderDetail(
                      'Branch Name',
                      order?.data?.bank_details[0]?.branch
                    )}
                  </>
                )}

                <Separator />
                {renderDetail('Token', order?.data?.token)}
                {renderDetail('Symbol', order?.data?.symbol)}
                {renderDetail('Price', order?.data?.price)}
                {renderDetail('Quantity', order?.data?.quantity?.toString())}
                {renderDetail('Total Investment', `₹ ${order?.data?.amount}`)}
                {renderDetail(
                  'Stamp Duty',
                  `₹ ${order?.data?.stampDuty || order?.data?.stamp_duty}`
                )}
                {renderDetail(
                  'Transaction Fee',
                  `₹ ${
                    order?.data?.transactionFee || order?.data?.transaction_fee
                  }`
                )}
                {renderDetail('GST', `₹ ${order?.data?.gst}`)}
                {renderDetail(
                  'Documentation Charges',
                  `₹ ${order?.data?.documentation_charges}`
                )}
                {page !== 'Sell' &&
                  renderDetail('Coins Used', order?.data?.coins)}
                {renderDetail(
                  'Total Purchase Value',
                  `₹ ${(+order?.data?.purchase_value).toFixed(2)}`
                )}
                {page !== 'Sell' &&
                  renderDetail(
                    'Side',
                    order?.data?.side,
                    order?.data?.side === 'Buy'
                      ? 'text-green-500'
                      : 'text-red-500'
                  )}

                <Separator />
                {!isAffiliate && page !== 'Sell' && (
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Field name="status">
                      {({ field }) => (
                        <Select
                          onValueChange={(value) =>
                            setFieldValue('status', value)
                          }
                          defaultValue={order?.data?.status || field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(PeOrderStatus).map(
                              ([key, value]) => (
                                <SelectItem key={key} value={key}>
                                  {value}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      )}
                    </Field>
                  </div>
                )}

                {isAffiliate &&
                  renderDetail(
                    'Status',
                    PeOrderStatus[order?.data?.status] || order?.data?.status
                  )}

                {!isAffiliate && page !== 'Sell' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="boId">Demat Account</Label>
                      <Field
                        as={Input}
                        id="boId"
                        name="boId"
                        placeholder="Update Demat Account"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="note">Note</Label>
                      <Field
                        as={Textarea}
                        id="note"
                        name="note"
                        placeholder="Add a note"
                      />
                    </div>
                  </>
                )}

                {['SIGN_AGREEMENT', 'VERIFICATION_PENDING', 'LOCKED'].includes(
                  order?.data?.status
                ) && (
                  <div className="space-y-2">
                    <Label htmlFor="uploadPdf">Upload Signed Agreement</Label>
                    <Input
                      id="uploadPdf"
                      type="file"
                      accept="application/pdf"
                      onChange={handleUpload}
                    />
                  </div>
                )}
                {order?.data?.status === 'SUCCESS' && (
                  <div className="space-y-2">
                    <Label>Invoice</Label>
                    <div className="mt-2">
                      <Invoice
                        data={order?.data}
                        paymentDate={order?.data?.payment_date}
                      />
                    </div>
                  </div>
                )}

                {!transferable && (
                  <div className="space-y-2">
                    <Label>NSE Invoice</Label>
                    <div className="mt-2">
                      <NSEInvoice data={{ ...order?.data, isUnsigned: true }} />
                    </div>
                  </div>
                )}

                {!transferable && (
                  <div className="space-y-2">
                    <Label>Agreement</Label>
                    <div className="mt-2">
                      {order?.data?.sign_agreement !== null ? (
                        <Link
                          href={order?.data?.sign_agreement}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button type="button" variant="outline">
                            Download Signed Agreement
                          </Button>
                        </Link>
                      ) : (
                        <NSEInvoice
                          data={{ ...order?.data, isUnsigned: false }}
                        />
                      )}
                    </div>
                  </div>
                )}
                {renderDateDetail('Created At', order?.data.created_at)}
                {renderDateDetail('Updated At', order?.data?.updated_at)}
                {order?.data?.payment_date &&
                  renderDateDetail('Payment Date', order?.data.payment_date)}
                {order?.data?.transfer_success_date &&
                  renderDateDetail(
                    'Transfer Success Date',
                    order?.data.transfer_success_date
                  )}

                {!isAffiliate && page !== 'Sell' && (
                  <SheetFooter>
                    {(order?.data?.status === 'TRANSFER_PENDING' ||
                      order?.data?.status === 'VERIFICATION_PENDING' ||
                      order?.data?.status === 'ADD_IDENTITY_DETAILS' ||
                      order?.data?.status === 'CONFIRM_IDENTITY_DETAILS' ||
                      order?.data?.status === 'SIGN_AGREEMENT' ||
                      order?.data?.status === 'LOCKED') && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsOpenRefundModal(true)}
                      >
                        Refund
                      </Button>
                    )}
                    <Button type="submit" disabled={isUpdating}>
                      {isUpdating ? 'Updating...' : 'Update Order'}
                    </Button>
                  </SheetFooter>
                )}
              </Form>
            )}
          </Formik>
        ) : (
          <div className="mt-4">No order data available.</div>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default OrderDetails