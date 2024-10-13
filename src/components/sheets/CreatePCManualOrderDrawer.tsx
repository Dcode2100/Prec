'use client'

import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createManualOrderForPC, getAssetsForPC } from '@/lib/api/ordersApi'
import { AssetsForPC } from '@/lib/types/types'
import { convertDateToUTC } from '@/utils/helper'
import moment from 'moment'
import { DatePicker } from '@/components/DatePicker'

const PCOrderStatus = {
  SUBSCRIPTION_PROCESSING: 'Processing',
  SUBSCRIPTION_PROCESSED: 'Processed',
}

const PCAssetsStatus = {
  live: 'Live',
  coming_soon: 'Coming soon',
  ON_TIME: 'On Time',
  DELAYED: 'Delayed',
  ENDED: 'Ended',
  REPAID: 'Repaid',
}

const PCAssetsState = {
  ACTIVE: 'Active',
  INACTIVE: 'In-active',
  ALL: 'All',
}

const validationSchema = Yup.object().shape({
  asset_id: Yup.string().required('Asset is required'),
  quantity: Yup.number()
    .required('Min quantity 1')
    .min(1, 'Minimum quantity should be 1')
    .test(
      'max-quantity',
      'Maximum quantity cannot exceed available quantity',
      function (value) {
        return value <= this.parent.available_quantity
      }
    ),
  price: Yup.number()
    .required('Price should be greater than 0')
    .moreThan(0, 'Price should be greater than 0'),
  status: Yup.string().required('Status can not be empty'),
  order_created_date: Yup.date()
    .nullable()
    .required('Order created date can not be empty'),
  subscription_confirmed_date: Yup.date().nullable(),
  payment_date: Yup.date().nullable(),
  subscription_processed_date: Yup.date().nullable(),
})

const InputField = ({
  name ,
  label,
  type = 'text',
  placeholder,
  errors,
  touched,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-start gap-4 ${className}`}>
      <Label htmlFor={name} className="text-muted-foreground w-[150px]">
        {label}
      </Label>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            {errors[name] && touched[name] && (
              <p className="text-red-500 text-[8px] mt-1">{errors[name]}</p>
            )}
            <Input
              {...field}
              id={name}
              type={type}
              disabled={disabled}
              defaultValue={
                type === 'datetime-local'
                  ? moment(field.value).format('YYYY-MM-DDTHH:mm')
                  : field.value
              }
              value={
                type === 'datetime-local'
                  ? moment(field.value).format('YYYY-MM-DDTHH:mm')
                  : field.value
              }
              onChange={(e) => {
                if (type === 'datetime-local') {
                  form.setFieldValue(name, convertDateToUTC(e.target.value))
                } else {
                  form.setFieldValue(name, e.target.value)
                }
              }}
              placeholder={placeholder}
              className={`w-[300px] rounded flex justify-between ${
                errors[name] && touched[name] ? 'border-red-500' : ''
              }`}
            />
          </div>
        )}
      </Field>
    </div>
  )
}

const SelectField = ({
  name,
  label,
  placeholder,
  options,
  identifierName = 'label',
  identifierValue = 'value',
  errors,
  touched,
  className = '',
  onChange,
}) => {
  return (
    <div className={`flex items-center justify-start gap-4 ${className}`}>
      <Label htmlFor={name} className="text-muted-foreground w-[150px]">
        {label}
      </Label>
      <Field name={name}>
        {({ field, form }) => (
          <Select
            value={field.value}
            onValueChange={(value) => {
              form.setFieldValue(name, value)
              if (onChange) {
                onChange(value)
              }
            }}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder={placeholder || 'Select an option'} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {options.map((option) => (
                  <SelectItem
                    key={option[identifierValue]}
                    value={option[identifierValue]}
                  >
                    {option[identifierName]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
      </Field>
      {errors[name] && touched[name] && (
        <p className="text-red-500 text-sm mt-1">{errors[name]}</p>
      )}
    </div>
  )
}

const DatePickerField = ({
  name,
  label,
  errors,
  touched,
  className = '',
  showTime = false,
}) => {
  return (
    <div className={`flex items-center justify-start gap-4 ${className}`}>
      <Label htmlFor={name} className="text-muted-foreground w-[150px]">
        {label}
      </Label>
      <Field name={name}>
        {({ field, form }) => (
          <div>
            {errors[name] && touched[name] && (
              <p className="text-red-500 text-[8px] mt-1">{errors[name]}</p>
            )}
            <DatePicker
              date={field.value}
              setDate={(date) => form.setFieldValue(name, date)}
              placeholder={`Select ${label}`}
              className={`w-[300px] ${
                errors[name] && touched[name] ? 'border-red-500' : ''
              }`}
              showTime={showTime}
            />
          </div>
        )}
      </Field>
    </div>
  )
}

const CreatePCManualOrderModal = ({
  isOpen,
  onClose,
  accountId,
  coinBalance,
}) => {
  const { toast } = useToast()
  const [filter, setFilter] = useState({ status: 'LIVE', state: 'ACTIVE' })
  const [assets, setAssets] = useState<AssetsForPC[]>([])

  const initialValues = {
    user_id: accountId,
    asset_id: '',
    status: 'SUBSCRIPTION_PROCESSING',
    quantity: 1,
    price: 0,
    transaction_fee: 0,
    is_fee_in_percent: true,
    gst: 0,
    is_gst_in_percent: true,
    coins: 0,
    check_balance: true,
    order_created_date: null,
    subscription_confirmed_date: null,
    payment_date: null,
    subscription_processed_date: null,
  }

  const fetchAssets = async (filter) => {
    const response = await getAssetsForPC(filter)
    return response.data.assets
  }

  const { data: assetsData } = useQuery({
    queryKey: ['assets', filter],
    queryFn: () => fetchAssets(filter),
    staleTime: 0,
  })

  useEffect(() => {
    if (assetsData) {
      setAssets(assetsData)
    }
  }, [assetsData])

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      const response = await createManualOrderForPC(values)
      if (response?.statusCode === 201 || response?.statusCode === 200) {
        toast({
          variant: 'success',
          description: 'Order created successfully',
        })
        onClose()
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error creating order',
      })
    }
    setSubmitting(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-[540px]">
        <SheetHeader>
          <SheetTitle>Create PC Orders</SheetTitle>
          <SheetDescription>
            Create a new manual order for private credit
          </SheetDescription>
        </SheetHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-4 mt-4">
              <SelectField
                name="status"
                label="Asset Status"
                placeholder="Select Asset Status"
                options={Object.entries(PCAssetsStatus).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                errors={errors}
                touched={touched}
                onChange={(value) => {
                  setFieldValue('status', value)
                  setFilter((prev) => ({ ...prev, status: value }))
                }}
              />

              <SelectField
                name="state"
                label="State"
                placeholder="Select State"
                options={Object.entries(PCAssetsState).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                errors={errors}
                touched={touched}
                onChange={(value) => {
                  setFieldValue('state', value)
                  setFilter((prev) => ({ ...prev, state: value }))
                }}
              />

              <SelectField
                name="asset_id"
                label="Asset"
                placeholder="Select Asset"
                options={assets}
                identifierName="name"
                identifierValue="id"
                errors={errors}
                touched={touched}
                onChange={(value) => {
                  setFieldValue('asset_id', value)
                  const selectedAsset = assets.find(
                    (asset) => asset.id === value
                  )
                  if (selectedAsset) {
                    setFieldValue('price', selectedAsset.price)
                    setFieldValue(
                      'transaction_fee',
                      selectedAsset.transaction_fees
                    )
                    setFieldValue('gst', selectedAsset.gst)
                  }
                }}
              />

              <InputField
                name="quantity"
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                errors={errors}
                touched={touched}
              />

              <InputField
                name="price"
                label="Price"
                type="number"
                placeholder="Enter price"
                errors={errors}
                touched={touched}
              />

              <SelectField
                name="status"
                label="Status"
                placeholder="Select Status"
                options={Object.entries(PCOrderStatus).map(([key, value]) => ({
                  value: key,
                  label: value,
                }))}
                errors={errors}
                touched={touched}
                onChange={(value) => {
                  setFieldValue('status', value)
                }}
              />

              <DatePickerField
                name="order_created_date"
                label="Order created date"
                errors={errors}
                touched={touched}
                showTime={true}
              />

              <DatePickerField
                name="subscription_confirmed_date"
                label="Subscription Confirmed Date"
                errors={errors}
                touched={touched}
                disabled={!values.order_created_date}
                showTime={true}
              />

              <DatePickerField
                name="payment_date"
                label="Payment date"
                errors={errors}
                touched={touched}
                disabled={!values.subscription_confirmed_date}
                showTime={true}
              />

              <DatePickerField
                name="subscription_processed_date"
                label="Subscription Processed Date"
                errors={errors}
                touched={touched}
                disabled={!values.payment_date}
                showTime={true}
              />

              <RadioGroup
                onValueChange={(value) =>
                  setFieldValue('is_fee_in_percent', value === 'true')
                }
                defaultValue="true"
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="fee-percent" />
                  <Label htmlFor="fee-percent">
                    Transaction Fee Percent (%)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="fee-amount" />
                  <Label htmlFor="fee-amount">Transaction Fee Amount (₹)</Label>
                </div>
              </RadioGroup>

              <InputField
                name="transaction_fee"
                label={`Transaction Fee ${
                  values.is_fee_in_percent ? '(%)' : '(₹)'
                }`}
                type="number"
                placeholder={values.is_fee_in_percent ? '2%' : '00'}
                errors={errors}
                touched={touched}
              />

              <RadioGroup
                onValueChange={(value) =>
                  setFieldValue('is_gst_in_percent', value === 'true')
                }
                defaultValue="true"
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="gst-percent" />
                  <Label htmlFor="gst-percent">GST Percent (%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="gst-amount" />
                  <Label htmlFor="gst-amount">GST Amount (₹)</Label>
                </div>
              </RadioGroup>

              <InputField
                name="gst"
                label={`GST ${values.is_gst_in_percent ? '(%)' : '(₹)'}`}
                type="number"
                placeholder={values.is_gst_in_percent ? '18%' : '00'}
                errors={errors}
                touched={touched}
              />

              {coinBalance > 0 && (
                <InputField
                  name="coins"
                  label="Coins"
                  type="number"
                  placeholder={`Available Coins ${coinBalance}`}
                  errors={errors}
                  touched={touched}
                />
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="check_balance"
                  checked={values.check_balance}
                  onCheckedChange={(checked) =>
                    setFieldValue('check_balance', checked)
                  }
                />
                <Label htmlFor="check_balance">Check Balance</Label>
              </div>

              <Button type="submit" className="w-full">
                Create Order
              </Button>
            </Form>
          )}
        </Formik>
      </SheetContent>
    </Sheet>
  )
}

export default CreatePCManualOrderModal
