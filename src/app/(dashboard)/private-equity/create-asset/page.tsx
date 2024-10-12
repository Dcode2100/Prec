'use client'
import React, { useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-separator'
import { useToast } from '@/hooks/use-toast'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Card, CardContent, CardTitle } from '@/components/ui/card'

import { convertDateToUTC } from '@/utils/helper'
import { useRouter } from 'next/navigation'
import moment from 'moment'
import { createPeAsset } from '@/lib/api/equityApi'
import { createPeAssetType, FinancialReportInterface } from '@/lib/types/types'
import { Paperclip, PlusCircle, Trash, X, XIcon } from 'lucide-react'
import { UploadAssetDocuments } from '@/lib/api/mediaHandlerApi'
import Image from 'next/image'

const validationSchema = Yup.object().shape({
  token: Yup.string().required('Token is required'),
  symbol: Yup.string().required('Symbol is required'),
  slug: Yup.string().required('Slug is required'),
  pan: Yup.string(),
  price: Yup.number().required().min(0, 'Price must be positive'),
  documentationCharges: Yup.number()
    .required()
    .min(0.0, 'Documentation charges must be positive'),
  availableQuantity: Yup.number()
    .required()
    .min(0, 'Available quantity must be positive'),
  inventoryQuantity: Yup.number()
    .required()
    .min(0, 'Inventory quantity must be positive'),
  minQuantity: Yup.number().required().min(0, 'Min quantity must be positive'),
  maxQuantity: Yup.number().required().min(0, 'Max quantity must be positive'),
  minOrderValue: Yup.number().min(0, 'Min order value must be positive'),
  maxOrderValue: Yup.number().min(0, 'Max order value must be positive'),
  sector: Yup.string().required('Sector is required'),
  hq: Yup.string().required('HQ is required'),
  faceValue: Yup.number().min(0, 'Face value must be positive'),
  sequenceNo: Yup.number().required().min(0, 'Sequence no must be positive'),
  openSequenceNo: Yup.number()
    .required()
    .min(0, 'Open sequence no must be positive'),
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
const SwitchField = ({
  name,
  label,
  disabled = false,
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
          <div className="flex-col">
            {errors[name] && touched[name] && (
              <p className="text-red-500 text-[8px] mt-1">{errors[name]}</p>
            )}
            <Switch
              id={name}
              disabled={disabled}
              checked={field.value}
              onCheckedChange={(checked) => form.setFieldValue(name, checked)}
              className={cn(
                errors[name] && touched[name] ? 'border-red-500' : '',
                'roundeded flex justify-between'
              )}
            />
          </div>
        )}
      </Field>
    </div>
  )
}
const FinancialReportForm = ({ onSubmit, onClose }) => {
  const [financialReportType, setFinancialReportType] = useState('FY')
  const [isLoadingFile, setIsLoadingFile] = useState(false)
  const [financialReportBlobImages, setFinancialReportBlobImages] = useState('')
  const { toast } = useToast()

  const handleFinancialReportFileUpload = (event, setFieldValue) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: 'Invalid file type',
          description: 'Only PDF files are allowed.',
          variant: 'destructive',
        })
        return
      }
      setIsLoadingFile(true)

      const blobUrl = URL.createObjectURL(file)
      setFinancialReportBlobImages(blobUrl)
      setFieldValue('file', file)
      setIsLoadingFile(false)
    }
  }

  return (
    <div className="relative w-[400px]">
      <X className="absolute top-8 right-8" onClick={onClose} />
      <Formik
        initialValues={{
          financialReportType: 'FY',
          title: '',
          file: null as File | null,
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          onSubmit(values, 'application/pdf')
          setSubmitting(false)
          resetForm()
        }}
      >
        {({ values, setFieldValue, isSubmitting, errors }) => (
          <Form>
            <Card>
              <CardContent className="mt-4">
                <CardTitle className="my-2">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Financial Report
                  </h2>
                </CardTitle>
                <RadioGroup
                  defaultValue="FY"
                  onValueChange={(value) => {
                    setFinancialReportType(value)
                    setFieldValue('financialReportType', value)
                    if (value === 'DRHP') {
                      setFieldValue('title', 'DRHP Report')
                    } else {
                      setFieldValue('title', '')
                    }
                  }}
                >
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="FY" id="FY" />
                      <Label htmlFor="FY">Financial Report</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="DRHP" id="DRHP" />
                      <Label htmlFor="DRHP">DRHP Report</Label>
                    </div>
                  </div>
                </RadioGroup>

                <div className="mt-4 space-x-2">
                  {financialReportType === 'FY' ? (
                    <div className="flex h-[40px]">
                      <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                        Annual Report
                      </span>
                      <Field
                        as={Input}
                        id="title"
                        type="text"
                        name="title"
                        placeholder="FY22"
                        className="rounded-none rounded-r-lg h-full"
                      />
                    </div>
                  ) : (
                    <Input
                      type="text"
                      id="title"
                      placeholder="DRHP Report"
                      value="DRHP Report"
                      disabled
                      className="w-full"
                    />
                  )}
                </div>

                <div className="mt-4">
                  <Input
                    id="file"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(event) =>
                      handleFinancialReportFileUpload(event, setFieldValue)
                    }
                  />
                  <Label
                    htmlFor="file"
                    className="flex items-center justify-center w-40 px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-200 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 cursor-pointer"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach file
                  </Label>
                </div>

                {isLoadingFile && <div>Loading</div>}

                {values.file && (
                  <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-800 rounded-md relative">
                    <a
                      href={financialReportBlobImages}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="truncate">{values.file.name}</p>
                    </a>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6"
                      onClick={() => {
                        setFieldValue('file', null)
                        setFinancialReportBlobImages('')
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Button
                  type="button"
                  className="mt-4"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (Object.keys(errors).length === 0) {
                      onSubmit(values, 'application/pdf')
                      setFieldValue('title', '')
                      setFieldValue('file', null)
                      setFinancialReportBlobImages('')
                    } else {
                      toast({
                        title: 'Validation Error',
                        description: 'Please fill all required fields',
                        variant: 'destructive',
                      })
                    }
                  }}
                >
                  {isSubmitting ? <div>Loading</div> : 'Save'}
                </Button>
              </CardContent>
            </Card>
          </Form>
        )}
      </Formik>
    </div>
  )
}

interface FinancialReport {
  title: string
  link: string
}

interface FinancialReportListProps {
  financialReportBlobImages: FinancialReport[]
  handleRemoveFinancialReport: (index: number) => void
}

const FinancialReportList: React.FC<FinancialReportListProps> = ({
  financialReportBlobImages,
  handleRemoveFinancialReport,
}) => {
  return (
    <div>
      {financialReportBlobImages.map((file, index) => (
        <div key={index} className="mt-4 flex items-center justify-between">
          <a
            href={file.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>{file.title}</span>
          </a>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRemoveFinancialReport(index)}
            className="ml-4"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}

export function NewAssetBreadcrumb() {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/private-equity">Private Equity</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/privatecredit/create-asset">
            Create Asset
          </BreadcrumbLink>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
interface FileUploadConfig {
  name: string
  type: string
  setUrl: (url: string) => void
  setBlobImage: (url: string) => void
  setPayloadState: (state: { [key: string]: string }) => void
}

const EquityDetailsForm = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [token, setToken] = useState('')
  const [isFinancialReportFormOpen, setIsFinancialReportFormOpen] =
    useState(false)
  const fileSize = 10485760

  const [glanceReportBlobImages, setGlanceReportBlobImages] = useState<
    string[]
  >([])
  const [glanceReportUrls, setGlanceReportUrls] = useState<string[]>([])
  const [fullReportBlobImage, setFullReportBlobImage] = useState<string>('')
  const [fullReportUrl, setFullReportUrl] = useState<string>('')
  const [financialReportBlobImages, setFinancialReportBlobImages] = useState<
    FinancialReportInterface[]
  >([])
  const [logoBlobImage, setLogoBlobImage] = useState<string>('')
  const [logoUrl, setLogoUrl] = useState<string>('')
  const [logoMarkBlobImage, setLogoMarkBlobImage] = useState<string>('')
  const [logoMarkUrl, setLogoMarkUrl] = useState<string>('')
  const [mobileLogoBlobImage, setMobileLogoBlobImage] = useState<string>('')
  const [mobileLogoUrl, setMobileLogoUrl] = useState<string>('')

  const fileConfigs: Record<string, FileUploadConfig> = {
    glanceReports: {
      name: 'glanceReport',
      type: 'GLANCE_REPORT',
      setBlobImage: (url) =>
        setGlanceReportBlobImages((prev) => [...prev, url]),
      setUrl: (url) => setGlanceReportUrls((prev) => [...prev, url]),
      setPayloadState: (state) =>
        setValues((prev) => ({
          ...prev,
          glanceReports: [...(prev.glanceReports || []), state.glanceReport],
        })),
    },
    fullReport: {
      name: 'fullReport',
      type: 'FULL_REPORT',
      setBlobImage: setFullReportBlobImage,
      setUrl: setFullReportUrl,
      setPayloadState: (state) => setValues((prev) => ({ ...prev, ...state })),
    },
    logo: {
      name: 'logo',
      type: 'LOGO',
      setBlobImage: setLogoBlobImage,
      setUrl: setLogoUrl,
      setPayloadState: (state) => setValues((prev) => ({ ...prev, ...state })),
    },
    logoMark: {
      name: 'logoMark',
      type: 'LOGOMARK',
      setBlobImage: setLogoMarkBlobImage,
      setUrl: setLogoMarkUrl,
      setPayloadState: (state) => setValues((prev) => ({ ...prev, ...state })),
    },
    mobileLogo: {
      name: 'mobileLogo',
      type: 'MOBILE_LOGO',
      setBlobImage: setMobileLogoBlobImage,
      setUrl: setMobileLogoUrl,
      setPayloadState: (state) => setValues((prev) => ({ ...prev, ...state })),
    },
  }
  const [values, setValues] = useState<createPeAssetType>({
    token: '',
    symbol: '',
    slug: '',
    pan: '',
    price: 0,
    documentationCharges: 0,

    availableQuantity: 0,
    inventoryQuantity: 0,
    minQuantity: 0,
    maxQuantity: 0,
    minOrderValue: 0,
    maxOrderValue: 0,

    info: '',
    about: '',
    sector: '',
    hq: '',
    link: '',
    faceValue: 0,

    sequenceNo: 0,
    openSequenceNo: 0,

    nsdl: false,
    cdsl: false,
    soldOut: false,
    onlyFewLeft: false,
    comingSoon: false,

    isListedOnExchange: false,
    blockDeal: false,
    transferable: false,
    capitalReduction: false,
    amalgamation: false,
    manageInventory: false,

    openActive: false,
    openSpotlight: false,
    active: false,
    glanceReports: [],
    fullReport: '',
    financialReports: [],
    logo: '',
    logoMark: '',
    mobileLogo: '',
  })
  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileFormat: string
  ) => {
    if (token === '') {
      toast({
        title: 'Please enter company ISIN first',
        variant: 'warning',
      })
      return
    }
    const file = e.target.files?.[0]
    if (!file) return

    const config = fileConfigs[e.target.name]
    if (!config) return

    if (file.type !== fileFormat) {
      toast({
        title: 'Incorrect file format',
        variant: 'warning',
      })
      return
    }

    if (file.size >= fileSize) {
      toast({ title: 'File is too big', variant: 'warning' })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', config.type)
    if (config.type === 'FINANCIAL_REPORTS') {
      formData.append('fileName', file.name)
    }

    try {
      const upload = await UploadAssetDocuments(token, formData)
      if (upload?.statusCode === 201) {
        const blob = URL.createObjectURL(file)
        config.setBlobImage(blob)
        config.setUrl(upload.data.filePath)
        if (config.name === 'glanceReports') {
          config.setPayloadState({ glanceReport: upload.data.filePath })
        } else {
          config.setPayloadState({ [config.name]: upload.data.filePath })
        }
      }
    } catch (err) {
      console.error(`Error uploading ${config.name}:`, err)
    } finally {
      setIsFinancialReportFormOpen(false)
    }
  }

  const handleFileUploadFinancialReport = async (
    e: {
      title: string
      file: File
    },
    fileFormat: string
  ) => {
    if (token === '') {
      toast({
        title: 'Please enter company ISIN first',
        variant: 'warning',
      })
      return
    }

    const file = e.file
    if (!file) return

    if (file.type !== fileFormat) {
      toast({
        title: 'Incorrect file format',
        variant: 'warning',
      })
      return
    }

    if (file.size >= fileSize) {
      toast({ title: 'File is too big', variant: 'warning' })
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('fileType', 'FINANCIAL_REPORTS')
    formData.append('title', e.title)

    try {
      const upload = await UploadAssetDocuments(token, formData)
      if (upload?.statusCode === 201) {
        const newReport = {
          title: file.name,
          link: upload.data.filePath,
        }
        setFinancialReportBlobImages((prev) => [...prev, newReport])
        setValues((prev) => ({
          ...prev,
          financialReports: [...prev.financialReports, newReport],
        }))
      }
    } catch (err) {
      console.error(`Error uploading Financial Report:`, err)
    } finally {
      setIsFinancialReportFormOpen(false)
    }
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    const body: createPeAssetType = {
      token: values?.token || '',
      symbol: values?.symbol || '',
      pan: values?.pan || '',
      slug: values?.slug || '',
      price: Number(values?.price) || 0,
      documentationCharges: Number(values?.documentationCharges) || 0,

      availableQuantity: Number(values?.availableQuantity) || 0,
      inventoryQuantity: Number(values?.inventoryQuantity) || 0,
      minQuantity: Number(values?.minQuantity) || 0,
      maxQuantity: Number(values?.maxQuantity) || 0,
      minOrderValue: Number(values?.minOrderValue) || 0,
      maxOrderValue: Number(values?.maxOrderValue) || 0,

      info: values?.info || '',
      about: values?.about || '',
      sector: values?.sector || '',
      hq: values?.hq || '',
      link: values?.link || '',
      faceValue: Number(values?.faceValue) || 0,

      sequenceNo: Number(values?.sequenceNo) || 0,
      openSequenceNo: Number(values?.openSequenceNo) || 0,

      nsdl: values?.nsdl || false,
      cdsl: values?.cdsl || false,
      soldOut: values?.soldOut || false,
      onlyFewLeft: values?.onlyFewLeft || false,
      comingSoon: values?.comingSoon || false,

      isListedOnExchange: values?.isListedOnExchange || false,
      blockDeal: values?.blockDeal || false,
      transferable: values?.transferable || false,
      capitalReduction: values?.capitalReduction || false,
      amalgamation: values?.amalgamation || false,
      manageInventory: values?.manageInventory || false,

      openActive: values?.openActive || false,
      openSpotlight: values?.openSpotlight || false,
      active: values?.active || false,
      glanceReports: glanceReportUrls || [],
      fullReport: fullReportUrl || '',
      financialReports: financialReportBlobImages || [],
      logo: logoUrl || '',
      logoMark: logoMarkUrl || '',
      mobileLogo: mobileLogoUrl || '',
    }
    setSubmitting(true)
    try {
      const response = await createPeAsset(body)
      if (response.statusCode === 201) {
        toast({
          variant: 'success',
          description: 'Asset added successfully',
        })
        router.replace('/private-equity')
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error updating asset',
      })
    }
    setSubmitting(false)
  }

  const handleRemoveFinancialReport = (index: number) => {
    setFinancialReportBlobImages((prev) => {
      const newArray = [...prev]
      newArray.splice(index, 1)
      return newArray
    })
    setValues((prev) => ({
      ...prev,
      financialReports: prev.financialReports.filter((_, i) => i !== index),
    }))
  }
  return (
    <div className="w-full h-full px-10 h-[70%]">
      <NewAssetBreadcrumb />

      <div className="space-y-2 overflow-auto  ">
        <Formik
          initialValues={values}
          enableReinitialize={false}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form className="space-y-2 w-full mb-[100px]">
              <div className=" mb-4">
                <h1 className="text-2xl font-bold tracking-tight">
                  Create Asset
                </h1>
                <p className="text-muted-foreground">
                  {/* Create new private equity asset */}
                </p>
              </div>
              {/* Token Field */}
              <div className={cn('flex items-center justify-start gap-4')}>
                <Label
                  htmlFor="token"
                  className="text-muted-foreground w-[150px]"
                >
                  ISIN
                </Label>
                <Field name="token">
                  {({ field, form }) => (
                    <div>
                      {errors.token && touched.token && (
                        <p className="text-red-500 text-[8px] mt-1">
                          {errors.token}
                        </p>
                      )}
                      <Input
                        {...field}
                        id="token"
                        type="text"
                        onChange={(e) => {
                          form.setFieldValue('token', e.target.value)
                          setToken(e.target.value)
                        }}
                        placeholder="token"
                        className={cn(
                          errors.token && touched.token ? 'border-red-500' : '',
                          'w-[300px] rounded flex justify-between'
                        )}
                      />
                    </div>
                  )}
                </Field>
              </div>
              <InputField
                name="symbol"
                label="Company Name"
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

                <InputField
                  name="pan"
                  label="Pan number"
                  placeholder="Pan number"
                  className="ml-10"
                  errors={errors}
                  touched={touched}
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
                <InputField
                  name="documentationCharges"
                  label="Documentation charges"
                  type="number"
                  placeholder="Enter documentation charges"
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
                  name="availableQuantity"
                  label="Available Quantity"
                  type="number"
                  placeholder="Enter quantity"
                  errors={errors}
                  touched={touched}
                />
                <InputField
                  name="inventoryQuantity"
                  label="Inventory Quantity"
                  type="number"
                  placeholder="Enter min order quantity"
                  className="ml-10"
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="flex items-center justify-start ">
                {/* Max Quantity Field */}
                <InputField
                  name="minQuantity"
                  label="Min Quantity"
                  type="number"
                  placeholder="Enter max quantity"
                  className=""
                  errors={errors}
                  touched={touched}
                />
                <InputField
                  name="maxQuantity"
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
                  name="minOrderValue"
                  label="Min order value"
                  type="number"
                  placeholder="Enter min order value"
                  errors={errors}
                  touched={touched}
                />
                {/* Max Quantity Field */}
                <InputField
                  name="maxOrderValue"
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
                {/* Info Field */}
                <InputField
                  name="info"
                  label="Info"
                  placeholder="Company details"
                  errors={errors}
                  touched={touched}
                />
                {/* SectorField */}
                <InputField
                  name="sector"
                  label="Sector"
                  placeholder="sector"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div className="flex items-center justify-start ">
                {/* About Field*/}
                <InputField
                  name="about"
                  label="about"
                  placeholder="About"
                  errors={errors}
                  touched={touched}
                />
                {/* HQ Field */}
                <InputField
                  name="hq"
                  label="Head quarter"
                  placeholder="sector"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div className="flex items-center justify-start ">
                {/* Link Field*/}
                <InputField
                  name="link"
                  label="URL"
                  placeholder="URL"
                  errors={errors}
                  touched={touched}
                />
                <InputField
                  name="faceValue"
                  label="Face value"
                  placeholder="Face value"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>

              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex items-center justify-start">
                {/* open sequence no Field */}
                <InputField
                  name="openSequenceNo"
                  label="Open Sequence No"
                  type="number"
                  placeholder="Enter Open Sequence No"
                  errors={errors}
                  touched={touched}
                />
                {/* open active Field */}
                <InputField
                  name="sequenceNo"
                  label="Sequence No"
                  type="number"
                  placeholder="Enter Sequence No"
                  errors={errors}
                  touched={touched}
                  className="ml-10"
                />
              </div>
              <div>
                <Separator className="my-4 h-[1px]  bg-muted" />
              </div>
              <div className="flex">
                <div className="flex flex-col items-start gap-2 justify-start w-[20%]">
                  {/* NSDL */}
                  <SwitchField
                    name="nsdl"
                    label="NSDL"
                    errors={errors}
                    touched={touched}
                  />
                  {/* CDSL */}
                  <SwitchField
                    name="cdsl"
                    label="CDSL"
                    errors={errors}
                    touched={touched}
                  />
                  <div className="w-[80%]">
                    <Separator className="my-4 h-[1px] w-full bg-muted" />
                  </div>
                  {/* Sold Out */}
                  <SwitchField
                    name="soldOut"
                    label="Sold Out"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Only Few Left */}
                  <SwitchField
                    name="onlyFewLeft"
                    label="Only Few Left"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Coming soon */}
                  <SwitchField
                    name="comingSoon"
                    label="Coming soon"
                    errors={errors}
                    touched={touched}
                  />
                  <div className="w-[80%]">
                    <Separator className="my-4 h-[1px] w-full bg-muted" />
                  </div>
                  {/* open active */}
                  <SwitchField
                    name="openActive"
                    label="Open active"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Open Spotlight */}
                  <SwitchField
                    name="openSpotlight"
                    label="Open spotlight"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="flex flex-col items-start justify-start w-[30%] gap-2">
                  {/* Listed on Exchange */}
                  <SwitchField
                    name="isListedonExchange"
                    label="is Listed"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Block deal */}
                  <SwitchField
                    name="blockDeal"
                    label="Block Deal"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Transferable */}
                  <SwitchField
                    name="transferable"
                    label="Transferable"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Capital Reduction */}
                  <SwitchField
                    name="capitalReduction"
                    label="Capital Reduction"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Amalgamation */}
                  <SwitchField
                    name="amalgamation"
                    label="Amalgamation"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Manage Inventory */}
                  <SwitchField
                    name="manageInventory"
                    label="Manage Inventory"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>
              {/* Glance report Field */}
              <div className="w-[20%] flex flex-col gap-2 items-start justify-start space-x-2">
                <label
                  htmlFor="glanceReports"
                  className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Glance Report
                  </span>
                </label>
                <input
                  id="glanceReports"
                  type="file"
                  name="glanceReports"
                  accept="image/png"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'image/png')}
                />
                {glanceReportBlobImages.length > 0 &&
                  glanceReportBlobImages.map((file, index) => (
                    <div key={index} className="mt-4">
                      <Image
                        src={file}
                        alt="Preview"
                        height={100}
                        width={100}
                        className="max-w-xs max-h-48  w-48 object-contain"
                      />
                    </div>
                  ))}
              </div>
              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>
              {/* Full report Field */}
              <div className="w-[20%] flex flex-col gap-2 items-start justify-start space-x-2">
                <label
                  htmlFor="fullReport"
                  className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                >
                  <Paperclip className="h-5 w-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Full Report
                  </span>
                </label>
                <input
                  id="fullReport"
                  type="file"
                  name="fullReport"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'application/pdf')}
                />
                {fullReportBlobImage && (
                  <div className="mt-4">
                    <a
                      href={fullReportBlobImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span>View Full Report</span>
                    </a>
                  </div>
                )}
              </div>
              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>
              <div className="">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Financial Reports</h2>
                  <Button
                    type="button"
                    variant={'outline'}
                    onClick={() => setIsFinancialReportFormOpen(true)}
                    className="flex items-center"
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Financial Report
                  </Button>
                </div>
                {/* Financial Report Field */}
                {isFinancialReportFormOpen && (
                  <FinancialReportForm
                    onSubmit={handleFileUploadFinancialReport}
                    onClose={() => setIsFinancialReportFormOpen(false)}
                  />
                )}
                {/* Financial Reports */}
                {financialReportBlobImages.length > 0 && (
                  <FinancialReportList
                    financialReportBlobImages={financialReportBlobImages}
                    handleRemoveFinancialReport={handleRemoveFinancialReport}
                  />
                )}
              </div>
              <div>
                <Separator className="my-4 h-[1px] bg-muted" />
              </div>

              <div className="flex w-full">
                {/* Logo Field */}
                <div className="w-[20%] flex flex-col gap-2 items-start justify-start space-x-2">
                  <label
                    htmlFor="logo"
                    className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Logo
                    </span>
                  </label>
                  <input
                    id="logo"
                    type="file"
                    name="logo"
                    accept="image/png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image/png')}
                  />
                  {logoBlobImage && (
                    <div className="">
                      <Image
                        src={logoBlobImage}
                        height={100}
                        width={100}
                        alt="Preview"
                        className="max-w-xs max-h-48  w-48 object-contain"
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Separator className="mx-4 w-[1px] h-full bg-muted" />
                </div>

                {/* Logo Mark Field */}
                <div className="w-[20%] flex flex-col gap-2 items-start justify-start space-x-2">
                  <label
                    htmlFor="logoMark"
                    className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Logo Mark
                    </span>
                  </label>
                  <input
                    id="logoMark"
                    type="file"
                    name="logoMark"
                    accept="image/png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image/png')}
                  />
                  {logoMarkBlobImage && (
                    <div className="mt-4">
                      <Image
                        src={logoMarkBlobImage}
                        height={100}
                        width={100}
                        alt="Preview"
                        className="max-w-xs max-h-48  w-48 object-contain"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Separator className="mx-4 w-[1px] h-full bg-muted" />
                </div>
                {/* Mobile Logo Field */}
                <div className="w-[20%] flex flex-col gap-2 items-start justify-start space-x-2">
                  <label
                    htmlFor="mobileLogo"
                    className="flex items-center space-x-2 cursor-pointer bg-gray-100 hover:bg-gray-200 transition-colors duration-200 px-4 py-2 rounded-md"
                  >
                    <Paperclip className="h-5 w-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">
                      Mobile Logo
                    </span>
                  </label>
                  <input
                    id="mobileLogo"
                    type="file"
                    name="mobileLogo"
                    accept="image/png"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, 'image/png')}
                  />
                  {mobileLogoBlobImage && (
                    <div className="mt-4">
                      <Image
                        src={mobileLogoBlobImage}
                        height={100}
                        width={100}
                        alt="Preview"
                        className="max-w-xs max-h-48  w-48 object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>
              {/* Submit Button */}
              <div className="fixed bottom-0 left-[72px] right-0 h-[50px] p-4 bg-background/80 backdrop-blur-sm border-t flex items-center justify-start shadow-lg">
                <Button
                  type="submit"
                  className="shadow-md hover:shadow-lg transition-shadow"
                >
                  Create
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
