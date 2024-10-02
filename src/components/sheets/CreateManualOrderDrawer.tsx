'use client'

import React, { useEffect, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useQuery } from '@tanstack/react-query'
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
import { Separator } from '@/components/ui/separator'
import { createManualOrder, getTokens } from '@/lib/api/ordersApi'
import { convertDateToUTC } from '@/utils/helper'
import moment from 'moment'
import { DatePicker } from '@/components/DatePicker'
import { TokenResponse } from '@/lib/types/types'

interface Token {
  price: string
}

const validationSchema = Yup.object().shape({
  token: Yup.string().required('Token is required'),
  quantity: Yup.number()
    .required('Min quantity 1')
    .min(1, 'Minimum quantity should be 1'),
  price: Yup.number()
    .required('Price should be greater than 0')
    .moreThan(0, 'Price should be greater than 0'),
  status: Yup.string().required('Status can not be empty'),
  orderCreatedDate: Yup.date()
    .nullable()
    .required('Order created date can not be empty'),
  paymentDate: Yup.date().nullable(),
  sharesTransferredDate: Yup.date().nullable(),
})

const InputField = ({
  name,
  label,
  type = 'text',
  placeholder,
  errors,
  touched,
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
              defaultValue={
                type === 'date'
                  ? moment(field.value).format('YYYY-MM-DD')
                  : field.value
              }
              value={
                type === 'date'
                  ? moment(field.value).format('YYYY-MM-DD')
                  : field.value
              }
              onChange={(e) => {
                if (type === 'date') {
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
                {options.length > 0 &&
                  options.map((option) => (
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
  disabled = false,
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

const CreateManualOrderModal = ({ isOpen, onClose, accountId }) => {
  const { toast } = useToast()
  const [tokens, setTokens] = useState<TokenResponse[]>([])
  const initialValues = {
    investorId: accountId,
    token: '',
    quantity: '',
    price: '',
    status: 'TRANSFER_PENDING',
    orderCreatedDate: '',
    paymentDate: '',
    sharesTransferredDate: '',
    transactionFee: '',
    stampDuty: '',
    isFeeInPercent: true,
    isStampDutyInPercent: true,
    isGstInPercent: true,
    checkBalance: true,
    pan: '',
    aadhaar: '',
    addressAsPerAadhaar: '',
    nameAsPerPan: '',
    coins: 0,
    gst: '',
    documentationCharges: "0",
  }

  const fetchTokens = async () => {
    const response = await getTokens()
    return response.data
  }

  const {
    data: tokensData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tokens'],
    queryFn: fetchTokens,
    staleTime: 5 * 60 * 1000,
  })

  useEffect(() => {
    if (tokensData) {
      setTokens(tokensData)
    }
  }, [tokensData])

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true)
    try {
      const response = await createManualOrder(values)
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
          <SheetTitle>Create PE Orders</SheetTitle>
          <SheetDescription>
            Create a new manual order for the investor
          </SheetDescription>
        </SheetHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-4 mt-4">
              <InputField
                name="investorId"
                label="Investor ID"
                placeholder="Enter Investor ID"
                errors={errors}
                touched={touched}
                // disabled
              />

              <SelectField
                name="token"
                label="Token"
                placeholder="Select token"
                options={tokens}
                identifierName="symbol"
                identifierValue="token"
                errors={errors}
                touched={touched}
                onChange={(value: string) => {
                  const selectedToken = tokens.find(
                    (token: TokenResponse) => token.token === value
                  )
                  if (selectedToken) {
                    setFieldValue('price', selectedToken.price)
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
                placeholder="Select status"
                options={[
                  { value: 'TRANSFER_PENDING', label: 'Transfer Pending' },
                  { value: 'SUCCESS', label: 'Completed' },
                ]}
                errors={errors}
                touched={touched}
                onChange={(value: string) => {
                  setFieldValue('status', value)
                }}
              />

              <DatePickerField
                name="orderCreatedDate"
                label="Order Created Date"
                errors={errors}
                touched={touched}
                showTime={true}
              />

              <DatePickerField
                name="paymentDate"
                label="Payment Date"
                errors={errors}
                touched={touched}
                showTime={true}
              />

              <DatePickerField
                name="sharesTransferredDate"
                label="Shares Transferred Date"
                errors={errors}
                touched={touched}
                showTime={true}
              />

              <Separator className="my-4" />

              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeeInPercent"
                  checked={values.isFeeInPercent}
                  onCheckedChange={(checked) =>
                    setFieldValue('isFeeInPercent', checked)
                  }
                />
                <Label htmlFor="isFeeInPercent">
                  Transaction Fee in Percent
                </Label>
              </div>

              <InputField
                name="transactionFee"
                label={`Transaction Fee ${
                  values.isFeeInPercent ? '(%)' : '(₹)'
                }`}
                type="number"
                placeholder="Enter transaction fee"
                errors={errors}
                touched={touched}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="isStampDutyInPercent"
                  checked={values.isStampDutyInPercent}
                  onCheckedChange={(checked) =>
                    setFieldValue('isStampDutyInPercent', checked)
                  }
                />
                <Label htmlFor="isStampDutyInPercent">
                  Stamp Duty in Percent
                </Label>
              </div>

              <InputField
                name="stampDuty"
                label={`Stamp Duty ${
                  values.isStampDutyInPercent ? '(%)' : '(₹)'
                }`}
                type="number"
                placeholder="Enter stamp duty"
                errors={errors}
                touched={touched}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="isGstInPercent"
                  checked={values.isGstInPercent}
                  onCheckedChange={(checked) =>
                    setFieldValue('isGstInPercent', checked)
                  }
                />
                <Label htmlFor="isGstInPercent">GST in Percent</Label>
              </div>

              <InputField
                name="gst"
                label={`GST ${values.isGstInPercent ? '(%)' : '(₹)'}`}
                type="number"
                placeholder="Enter GST"
                errors={errors}
                touched={touched}
              />

              <InputField
                name="documentationCharges"
                label="Documentation Charges"
                type="number"
                placeholder="Enter documentation charges"
                errors={errors}
                touched={touched}
              />

              <div className="flex items-center space-x-2">
                <Switch
                  id="checkBalance"
                  checked={values.checkBalance}
                  onCheckedChange={(checked) =>
                    setFieldValue('checkBalance', checked)
                  }
                />
                <Label htmlFor="checkBalance">Check Balance</Label>
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

export default CreateManualOrderModal
