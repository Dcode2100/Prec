'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-separator'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/hooks/use-toast'
import { getAllCategoriesOptionList, updatePcAsset } from '@/lib/api/creditApi'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from '@/components/ui/select'
import { tokenTypes } from '../data/data'
import { convertDateToUTC } from '@/utils/helper'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import moment from 'moment'
import { uploadDocumentByPcAssetId } from '@/lib/api/mediaHandlerApi'
import { Paperclip, X } from 'lucide-react'

const validationSchema = Yup.object().shape({
  category_id: Yup.string().required('Category is required'),
  name: Yup.string().required('Name is required'),
  slug: Yup.string().required('Slug is required'),

  price: Yup.number().required().min(0, 'Quantity must be positive'),
  transaction_fees: Yup.number().required().min(0, 'Quantity must be positive'),
  gst: Yup.number().required().min(0, 'Quantity must be positive'),

  available_quantity: Yup.number()
    .required()
    .min(0, 'Quantity must be positive'),
  min_quantity: Yup.number().required().min(0, 'Quantity must be positive'),
  max_quantity: Yup.number().required().min(0, 'Quantity must be positive'),
  min_order_value: Yup.number().required().min(0, 'Quantity must be positive'),
  max_order_value: Yup.number().required().min(0, 'Quantity must be positive'),
  rate_of_returns: Yup.number().required().min(0, 'Quantity must be positive'),
  ui_rate_of_returns: Yup.number()
    .required()
    .min(0, 'Quantity must be positive'),
  subscribed_value: Yup.number().required().min(0, 'Quantity must be positive'),
  max_subscription_value: Yup.number()
    .required()
    .min(0, 'Quantity must be positive'),

  start_date: Yup.string().required('Start date is required'),
  end_date: Yup.string().required('End date is required'),
  tentative_start_date: Yup.string().required(
    'Tentative start date is required'
  ),
  tentative_end_date: Yup.string().required('Tentative end date is required'),
  trade_start_date: Yup.string().required('Trade start date is required'),
  trade_end_date: Yup.string().required('Trade end date is required'),
  repaid_date: Yup.string().required('Repaid date is required'),

  tenure: Yup.number().required().min(0, 'Quantity must be positive'),
  tentative_tenure: Yup.number().required().min(0, 'Quantity must be positive'),

  sequence_number: Yup.number().required().min(0, 'Quantity must be positive'),
  open_sequence_no: Yup.number().required().min(0, 'Quantity must be positive'),
  status: Yup.string().required('Status is required'),
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
    <div className={cn('flex items-center justify-start gap-4', className)}>
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
              className={cn(
                errors[name] && touched[name] ? 'border-red-500' : '',
                'w-[300px] rounded flex justify-between'
              )}
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
}) => {
  return (
    <div className={cn('flex items-center justify-start gap-4', className)}>
      <Label htmlFor={name} className="text-muted-foreground w-[150px]">
        {label}
      </Label>
      <Field name={name}>
        {({ field, form }) => (
          <Select
            value={field.value}
            onValueChange={(value) => form.setFieldValue(name, value)}
          >
            <SelectTrigger className="w-[180px]">
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

export function NewAssetBreadcrumb() {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/privatecredit">Private Credit</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/privatecredit/create-assets">
            Update Asset
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

const EquityDetailsForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef(null)
  const { selectedAsset } = useSelector((state: RootState) => state.credit)
  const [category, setCategory] = useState([])
  const [tradeDocuments, setTradeDocuments] = useState(
    selectedAsset?.trade_reports || []
  )
  const values = {
    category_id: selectedAsset?.category_id || '',
    name: selectedAsset?.name || '',
    slug: selectedAsset?.slug || '',

    price: Number(selectedAsset?.price) || 0,
    transaction_fees: Number(selectedAsset?.transaction_fees) || 0,
    gst: Number(selectedAsset?.gst) || 0,

    available_quantity: Number(selectedAsset?.available_quantity) || 0,
    min_quantity: Number(selectedAsset?.min_quantity) || 0,
    max_quantity: Number(selectedAsset?.max_quantity) || 0,
    min_order_value: Number(selectedAsset?.min_order_value) || 0,
    max_order_value: Number(selectedAsset?.max_order_value) || 0,
    rate_of_returns: Number(selectedAsset?.rate_of_returns) || 0,
    ui_rate_of_returns: Number(selectedAsset?.ui_rate_of_returns) || 0,
    subscribed_value: Number(selectedAsset?.subscribed_value) || 0,
    max_subscription_value: Number(selectedAsset?.max_subscription_value) || 0,

    from: selectedAsset?.from || '',
    to: selectedAsset?.to || '',

    start_date: selectedAsset?.start_date || '',
    end_date: selectedAsset?.end_date || '',
    tentative_start_date: selectedAsset?.tentative_start_date || '',
    tentative_end_date: selectedAsset?.tentative_end_date || '',
    trade_start_date: selectedAsset?.trade_start_date || '',
    trade_end_date: selectedAsset?.trade_end_date || '',
    repaid_date: selectedAsset?.repaid_date || '',

    tenure: Number(selectedAsset?.tenure) || 0,
    tentative_tenure: Number(selectedAsset?.tentative_tenure) || 0,

    status: selectedAsset?.status || '',
    sequence_number: Number(selectedAsset?.sequence_number) || 0,
    open_sequence_no: Number(selectedAsset?.open_sequence_no) || 0,
    open_active: selectedAsset?.open_active || false,
    open_spotlight: selectedAsset?.open_spotlight || false,
    active: selectedAsset?.active || false,
    trade_details: selectedAsset?.trade_reports || [],
  }

  const fetchCategories = async () => {
    const data = await getAllCategoriesOptionList()
    return data.data.categories
  }
  const queryKey = useMemo(() => ['categories'], [])
  const { data: categories } = useQuery({
    queryKey,
    queryFn: () => fetchCategories(),
  })

  useEffect(() => {
    if (categories) {
      setCategory(categories)
    }
  }, [categories])
  useEffect(() => {
    if (selectedAsset) {
      setTradeDocuments(selectedAsset.trade_reports || [])
    }
  }, [selectedAsset])

  const handleMediaUpload = async (event) => {
    if (!selectedAsset) return
    const file = event.target.files[0]
    if (file) {
      try {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('name', file.name)

        const response = await uploadDocumentByPcAssetId(
          selectedAsset.id,
          formData
        )

        setTradeDocuments((prevDocuments) => [...prevDocuments, response])

        toast({
          variant: 'success',
          description: 'Media uploaded successfully',
        })
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Error uploading media',
        })
      }
    }
  }

  const handleRemoveFile = (e, removeIndex: number) => {
    e.preventDefault()
    setTradeDocuments((prevDocuments) =>
      prevDocuments.filter((doc, index) => removeIndex === index)
    )
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!selectedAsset) return
    const body = {
      category_id: values?.category_id || '',
      name: values?.name || '',
      slug: values?.slug || '',

      price: Number(values?.price) || 0,
      transaction_fees: Number(values?.transaction_fees) || 0,
      gst: Number(values?.gst) || 0,

      available_quantity: Number(values?.available_quantity) || 0,
      min_quantity: Number(values?.min_quantity) || 0,
      max_quantity: Number(values?.max_quantity) || 0,
      min_order_value: Number(values?.min_order_value) || 0,
      max_order_value: Number(values?.max_order_value) || 0,
      rate_of_returns: Number(values?.rate_of_returns) || 0,
      ui_rate_of_returns: Number(values?.ui_rate_of_returns) || 0,
      subscribed_value: Number(values?.subscribed_value) || 0,
      max_subscription_value: Number(values?.max_subscription_value) || 0,

      from: values?.from || '',
      to: values?.to || '',

      start_date: values?.start_date || '',
      end_date: values?.end_date || '',
      tentative_start_date: values?.tentative_start_date || '',
      tentative_end_date: values?.tentative_end_date || '',
      trade_start_date: values?.trade_start_date || '',
      trade_end_date: values?.trade_end_date || '',
      repaid_date: values?.repaid_date || '',

      tenure: Number(values?.tenure) || 0,
      tentative_tenure: Number(values?.tentative_tenure) || 0,

      status: values?.status || '',
      sequence_number: Number(values?.sequence_number) || 0,
      open_sequence_no: Number(values?.open_sequence_no) || 0,
      open_active: values?.open_active || false,
      open_spotlight: values?.open_spotlight || false,
      active: values?.active || false,
      highlights: values?.highlights || '',
      trade_details: tradeDocuments,
    }

    setSubmitting(true)
    try {
      const response = await updatePcAsset(selectedAsset?.id, body)
      if (response.statusCode === 200) {
        toast({
          variant: 'success',
          description: 'Asset updated successfully',
        })
        router.replace('/privatecredit')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error updating asset',
      })
    }
    setSubmitting(false)
  }

  return (
    <div className="w-full h-[90%] overflow-auto ">
      <NewAssetBreadcrumb />
      <div className=" mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Update Asset</h1>
        <p className="text-muted-foreground">
          update existing private credit asset
        </p>
      </div>
      <div className="space-y-2 ">
        <Formik
          initialValues={values}
          enableReinitialize={true}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-2 h-full w-full ">
              {/* Name Field */}
              <InputField
                name="name"
                label="Name"
                placeholder="Enter Name"
                errors={errors}
                touched={touched}
              />
              <div className="flex items-center justify-start">
                <InputField
                  name="slug"
                  label="Slug"
                  placeholder="Enter slug"
                  errors={errors}
                  touched={touched}
                />

                <SelectField
                  name="category_id"
                  label="Category"
                  placeholder="Select a category"
                  options={category}
                  identifierName="name"
                  identifierValue="id"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div className="flex items-center justify-start ">
                {/* Price Field */}
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
                  placeholder="Select a status"
                  identifierValue="value"
                  options={tokenTypes}
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex items-center justify-start ">
                {/*Available Quantity Field*/}
                <InputField
                  name="available_quantity"
                  label="Available Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="flex items-center justify-start ">
                {/* Min Quantity Field*/}
                <InputField
                  name="min_quantity"
                  label="Min order Quantity"
                  type="number"
                  placeholder="Enter min order quantity"
                  errors={errors}
                  touched={touched}
                />
                {/* Max Quantity Field */}
                <InputField
                  name="max_quantity"
                  label="Max Quantity"
                  type="number"
                  placeholder="Enter max quantity"
                  className="ml-10"
                  errors={errors}
                  touched={touched}
                />
              </div>
              <div className="flex items-center justify-start ">
                {/* Min order value Field*/}
                <InputField
                  name="min_order_value"
                  label="Min order value"
                  type="number"
                  placeholder="Enter min order value"
                  errors={errors}
                  touched={touched}
                />
                {/* Max Quantity Field */}
                <InputField
                  name="max_order_value"
                  label="Max order value"
                  type="number"
                  placeholder="Enter max value"
                  className="ml-10"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex items-center justify-start ">
                {/* transaction fees Field*/}
                <InputField
                  name="transaction_fees"
                  label="Transaction fees"
                  type="number"
                  placeholder="Enter transaction fees"
                  errors={errors}
                  touched={touched}
                />
                {/* GST Field */}
                <InputField
                  name="gst"
                  label="GST"
                  type="number"
                  placeholder="Enter GST"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div className="flex items-center justify-start ">
                {/* rate of returns Field*/}
                <InputField
                  name="rate_of_returns"
                  label="Rate of returns"
                  type="number"
                  placeholder="Enter rate of returns"
                  errors={errors}
                  touched={touched}
                />
                {/* UI rate of returns Field */}
                <InputField
                  name="ui_rate_of_returns"
                  label="UI rate of returns"
                  type="number"
                  placeholder="Enter UI rate of returns"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div className="flex items-center justify-start ">
                {/* subscribed value Field*/}
                <InputField
                  name="subscribed_value"
                  label="Subscribed value"
                  type="number"
                  placeholder="Enter subscribed value"
                  errors={errors}
                  touched={touched}
                />
                {/* Max Subscription value Field */}
                <InputField
                  name="max_subscription_value"
                  label="Max Subscription value"
                  type="number"
                  placeholder="Enter max subscription value"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>
              <div className="flex items-center justify-start">
                {/* to field */}
                <InputField
                  name="to"
                  label="To"
                  type="text"
                  placeholder="Enter To"
                  errors={errors}
                  touched={touched}
                />
                {/* from field */}
                <InputField
                  name="from"
                  label="From"
                  type="text"
                  placeholder="Enter From"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div className="flex items-center justify-start">
                {/* Tenure Field */}
                <InputField
                  name="tenure"
                  label="Tenure"
                  type="number"
                  placeholder="Enter Tenure"
                  errors={errors}
                  touched={touched}
                />
                {/* Tentative Tenure Field */}
                <InputField
                  name="tentative_tenure"
                  label="Tentative Tenure"
                  type="number"
                  placeholder="Enter Tentative Tenure"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex items-center justify-start">
                {/* Start Date Field */}
                <InputField
                  name="start_date"
                  label="Start Date"
                  type="date"
                  placeholder="Enter Start Date"
                  errors={errors}
                  touched={touched}
                />
                {/* End Date Field */}
                <InputField
                  name="end_date"
                  label="End Date"
                  type="date"
                  placeholder="Enter End Date"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
                {/* Tentative Start Date Field */}
              </div>
              <div className="flex items-center justify-start">
                <InputField
                  name="tentative_start_date"
                  label="Tentative Start Date"
                  type="date"
                  placeholder="Enter Tentative Start Date"
                  errors={errors}
                  touched={touched}
                />
                {/* Tentative End Date Field */}
                <InputField
                  name="tentative_end_date"
                  label="Tentative End Date"
                  type="date"
                  placeholder="Enter Tentative End Date"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div className="flex items-center justify-start">
                {/* Trade Start Date Field */}
                <InputField
                  name="trade_start_date"
                  label="Trade Start Date"
                  type="date"
                  placeholder="Enter Trade Start Date"
                  errors={errors}
                  touched={touched}
                />
                {/* Trade End Date Field */}
                <InputField
                  name="trade_end_date"
                  label="Trade End Date"
                  type="date"
                  placeholder="Enter Trade End Date"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div className="flex items-center justify-start">
                {/* Repaid Date Field */}
                <InputField
                  name="repaid_date"
                  label="Repaid Date"
                  type="date"
                  placeholder="Enter Repaid Date"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex items-center justify-start">
                {/* open sequence no Field */}
                <InputField
                  name="open_sequence_no"
                  label="Open Sequence No"
                  type="number"
                  placeholder="Enter Open Sequence No"
                  errors={errors}
                  touched={touched}
                />
                {/* open active Field */}
                <InputField
                  name="sequence_number"
                  label="Sequence No"
                  type="number"
                  placeholder="Enter Sequence No"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div className="flex items-center justify-between w-[30%]">
                {/* Open Active Switch */}
                <div className="flex justify-between w-full  items-center">
                  <Label
                    htmlFor="open_active"
                    className="text-muted-foreground w-[150px]"
                  >
                    Open Active
                  </Label>
                  <Switch
                    id="open_active"
                    checked={values.open_active}
                    onCheckedChange={(checked) =>
                      setFieldValue('open_active', checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-[30%]">
                {/* Open Active Switch */}
                <div className="flex justify-between w-full  items-center">
                  <Label
                    htmlFor="open_spotlight"
                    className="text-muted-foreground w-[150px]"
                  >
                    Open Spotlight
                  </Label>
                  <Switch
                    id="open_spotlight"
                    checked={values.open_spotlight}
                    onCheckedChange={(checked) =>
                      setFieldValue('open_spotlight', checked)
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between w-[30%]">
                {/* Open Active Switch */}
                <div className="flex justify-between w-full  items-center">
                  <Label
                    htmlFor="active"
                    className="text-muted-foreground w-[150px]"
                  >
                    Active
                  </Label>
                  <Switch
                    id="active"
                    checked={values.active}
                    onCheckedChange={(checked) =>
                      setFieldValue('active', checked)
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 items-start justify-start space-x-2">
                <label
                  htmlFor="file-input"
                  className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Upload a report
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="file-input"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,application/pdf"
                  className="hidden"
                  onChange={handleMediaUpload}
                />
                {tradeDocuments.length > 0 &&
                  tradeDocuments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-50 px-3 py-2 rounded-md"
                    >
                      <a href={file.file} target="_blank" rel="noreferrer">
                        {file.file_name}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-6 w-6 p-0 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                        onClick={(e) => handleRemoveFile(e, index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
              </div>
              {/* Submit Button */}
              <div className="absolute bottom-0 left-0 right-0 h-[8vh] p-4 bg-background/80 backdrop-blur-sm border-t flex items-center justify-start shadow-lg">
                <Button
                  type="submit"
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  Update
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default EquityDetailsForm
