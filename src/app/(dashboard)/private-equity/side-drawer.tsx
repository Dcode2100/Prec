import React, { useEffect, useMemo, useState } from 'react'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/redux/store'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { Separator } from '@radix-ui/react-separator'
import { useQuery } from '@tanstack/react-query'
import { getAssetById, updateAnAsset } from '@/lib/api/equityApi'
import { useToast } from '@/hooks/use-toast'
import { SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useRouter } from 'next/navigation'

const validationSchema = Yup.object().shape({
  symbol: Yup.string().required('Symbol is required'),
  slug: Yup.string().required('Slug is required'),
  pan: Yup.string(),
  metaTitle: Yup.string(),
  metaDescription: Yup.string(),
  price: Yup.number().min(0, 'Price must be positive'),
  avalaibleQuantity: Yup.number().min(0, 'Quantity must be positive'),
  inventoryQuantity: Yup.number().min(0, 'Inventory Quantity must be positive'),
  sequenceNo: Yup.number(),
  faceValue: Yup.number().min(0, 'Face value must be positive'),
  minQuantity: Yup.number().min(0),
  maxQuantity: Yup.number().min(0),
  minOrderValue: Yup.number().min(0),
  maxOrderValue: Yup.number().min(0),
  documentationCharges: Yup.number().min(0),
})

const InputField = ({
  name,
  label,
  type = 'text',
  placeholder,
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
        {({ field }) => (
          <div className="flex-col w-[300px]">
            {errors[name] && touched[name] && (
              <p className="text-red-500 text-[8px] mt-1">{errors[name]}</p>
            )}
            <Input
              {...field}
              id={name}
              type={type}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                errors[name] && touched[name] ? 'border-red-500' : '',
                ' rounded flex justify-between'
              )}
            />
          </div>
        )}
      </Field>
    </div>
  )
}

interface AssetFormProps {
  assetId: string
  setIsSheetOpen: (value: boolean) => void
  refetch: () => void
}

const EquityDetailsForm = ({
  assetId,
  setIsSheetOpen,
  refetch,
}: AssetFormProps) => {
  const { type } = useSelector((state: RootState) => state.user)
  const { toast } = useToast()
  const router = useRouter()

  const [values, setValues] = useState({
    symbol: '',
    slug: '',
    pan: '',
    metaTitle: '',
    metaDescription: '',

    price: 0,
    availableQuantity: 0,
    inventoryQuantity: 0,
    sequenceNo: 0,
    faceValue: 0,
    minQuantity: 0,
    maxQuantity: 0,
    minOrderValue: 0,
    maxOrderValue: 0,
    documentationCharges: 0,

    blockDeal: false,
    transferable: false,
    capitalReduction: false,
    amalgamation: false,
    manageInventory: false,

    nsdl: false,
    cdsl: false,

    comingSoon: false,
    soldOut: false,
    onlyFewLeft: false,

    openActive: false,
    openSpotlight: false,
    openSequenceNo: 0,
  })

  const fetchAccounts = async (token: string | null) => {
    if (!token) return
    const data = await getAssetById(token)
    return data
  }
  const queryKey = useMemo(() => ['tokensData' + assetId], [assetId])
  const {
    data: selectedAsset,
    isLoading,
    error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchAccounts(assetId),
  })
  useEffect(() => {
    if (selectedAsset) {
      // Update form values based on fetched asset data
      setValues({
        symbol: selectedAsset.symbol || '',
        slug: selectedAsset.slug || '',
        pan: selectedAsset.pan || '',
        metaTitle: selectedAsset.metaTitle || '',
        metaDescription: selectedAsset.metaDescription || '',

        price: +selectedAsset.price || 0,
        availableQuantity: +selectedAsset.availableQuantity || 0,
        inventoryQuantity: +selectedAsset.inventoryQuantity || 0,
        sequenceNo: +selectedAsset.sequenceNo || 0,
        faceValue: +selectedAsset.faceValue || 0,
        minQuantity: +selectedAsset.minQuantity || 0,
        maxQuantity: +selectedAsset.maxQuantity || 0,
        minOrderValue: +selectedAsset.minOrderValue || 0,
        maxOrderValue: +selectedAsset.maxOrderValue || 0,
        documentationCharges: +selectedAsset.documentationCharges || 0,

        blockDeal: selectedAsset.blockDeal || false,
        transferable: selectedAsset.transferable || false,
        capitalReduction: selectedAsset.capitalReduction || false,
        amalgamation: selectedAsset.amalgamation || false,
        manageInventory: selectedAsset.manageInventory || false,

        nsdl: selectedAsset.nsdl || false,
        cdsl: selectedAsset.cdsl || false,

        comingSoon: selectedAsset.comingSoon || false,
        soldOut: selectedAsset.soldOut || false,
        onlyFewLeft: selectedAsset.onlyFewLeft || false,

        openActive: selectedAsset.openActive || false,
        openSpotlight: selectedAsset.openSpotlight || false,
        openSequenceNo: +selectedAsset.openSequenceNo || 0,
      })
    }
  }, [selectedAsset])

  const handleSubmit = async (values, { setSubmitting }) => {
    if (!assetId)
      return toast({
        variant: 'destructive',
        description: 'Error fetching token',
      })
    try {
      const response = await updateAnAsset(assetId, values)
      setIsSheetOpen(false)
      if (response.statusCode === 201) {
        toast({ variant: 'success', description: 'Asset updated successfully' })
      }
      refetch()
    } catch (error) {
      toast({
        variant: 'destructive',
        description: 'Error updating asset',
      })
    }
    setSubmitting(false)
  }

  return (
    <SheetContent className="min-w-[500px] flex flex-col pb-0 scrollbar-hide">
      <SheetHeader>
        <SheetTitle>Asset Details</SheetTitle>
      </SheetHeader>
      {error ? (
        <div className="h-[85vh] w-full flex text-center justify-center items-center">
          Error fetching data
        </div>
      ) : isLoading ? (
        <div className="h-[85vh] w-full flex text-center justify-center items-center">
          Loading...
        </div>
      ) : (
        <div className="relative w-full flex flex-col ">
          <Formik
            initialValues={values}
            enableReinitialize={true}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, values, setFieldValue }) => (
              <Form className="flex flex-col flex-1">
                <div className="flex-1 space-y-4 overflow-y-auto px-2 mb-10">
                  {/* Symbol Field */}
                  <InputField
                    name="symbol"
                    label="Symbol"
                    placeholder="Enter Symbol"
                    disabled={type !== 'ADMIN'}
                    errors={errors}
                    touched={touched}
                  />
                  {/* Slug Field */}
                  <InputField
                    name="slug"
                    label="Slug"
                    placeholder="Enter slug"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Pan number */}
                  <InputField
                    name="pan"
                    label="Pan number"
                    placeholder="Enter pan"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Meta Title */}
                  <InputField
                    name="metaTitle"
                    label="Meta title"
                    placeholder="Meta title"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Meta Description */}
                  <InputField
                    name="metaDescription"
                    label="Meta Description"
                    placeholder="Meta Description"
                    errors={errors}
                    touched={touched}
                  />
                  <div>
                    <Separator className="my-4 h-[1px] bg-muted" />
                  </div>

                  {/* Price Field */}
                  <InputField
                    name="price"
                    label="Price"
                    placeholder="price"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Available Quantity Field */}
                  <InputField
                    name="availableQuantity"
                    label="Available Quantity"
                    placeholder="Available Quantity"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />

                  {/* Inventory Quantity Field */}
                  <InputField
                    name="inventoryQuantity"
                    label="Inventory Quantity"
                    placeholder="Inventory Quantity"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Sequence No Field */}
                  <InputField
                    name="sequenceNo"
                    label="Sequence No"
                    placeholder="Sequence No"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Face Value Field */}
                  <InputField
                    name="faceValue"
                    label="Face Value"
                    placeholder="Face Value"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Min Quantity Field */}
                  <InputField
                    name="minQuantity"
                    label="Min Quantity"
                    placeholder="Min Quantity"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Max Quantity Field */}
                  <InputField
                    name="maxQuantity"
                    label="Max Quantity"
                    placeholder="Max Quantity"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Min Order Value Field */}
                  <InputField
                    name="minOrderValue"
                    label="Min Order Value"
                    placeholder="Min Order Value"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Max Order Value Field */}
                  <InputField
                    name="maxOrderValue"
                    label="Max Order Value"
                    placeholder="Max Order Value"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />
                  {/* Documentation charges Field */}
                  <InputField
                    name="documentationCharges"
                    label="Documentation charges"
                    placeholder="Documentation charges"
                    type="number"
                    errors={errors}
                    touched={touched}
                  />

                  <div>
                    <Separator className="my-4 h-[1px] bg-muted" />
                  </div>

                  {/* Blok Deal Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="blockDeal"
                      className="text-muted-foreground w-[150px]"
                    >
                      Block Deal
                    </Label>
                    <Switch
                      id="blockDeal"
                      checked={values.blockDeal}
                      onCheckedChange={(checked) =>
                        setFieldValue('blockDeal', checked)
                      }
                    />
                  </div>
                  {/* Transferable Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="transferable"
                      className="text-muted-foreground w-[150px]"
                    >
                      Transferable
                    </Label>
                    <Switch
                      id="transferable"
                      checked={values.transferable}
                      onCheckedChange={(checked) =>
                        setFieldValue('transferable', checked)
                      }
                    />
                  </div>
                  {/* Capital Reduction Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="capitalReduction"
                      className="text-muted-foreground w-[150px]"
                    >
                      Capital Reduction
                    </Label>
                    <Switch
                      id="capitalReduction"
                      checked={values.capitalReduction}
                      onCheckedChange={(checked) =>
                        setFieldValue('capitalReduction', checked)
                      }
                    />
                  </div>
                  {/* Amalgamation Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="amalgamation"
                      className="text-muted-foreground w-[150px]"
                    >
                      Amalgamation
                    </Label>
                    <Switch
                      id="amalgamation"
                      checked={values.amalgamation}
                      onCheckedChange={(checked) =>
                        setFieldValue('amalgamation', checked)
                      }
                    />
                  </div>
                  {/* Manage Inventory Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="manageInventory"
                      className="text-muted-foreground w-[150px]"
                    >
                      Manage Inventory
                    </Label>
                    <Switch
                      id="manageInventory"
                      checked={values.manageInventory}
                      onCheckedChange={(checked) =>
                        setFieldValue('manageInventory', checked)
                      }
                    />
                  </div>

                  <div>
                    <Separator className="my-4 h-[1px] bg-muted" />
                  </div>

                  {/* NSDL Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="nsdl"
                      className="text-muted-foreground w-[150px]"
                    >
                      NSDL
                    </Label>
                    <Switch
                      id="nsdl"
                      checked={values.nsdl}
                      onCheckedChange={(checked) =>
                        setFieldValue('nsdl', checked)
                      }
                    />
                  </div>

                  {/* CDSL Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="cdsl"
                      className="text-muted-foreground w-[150px]"
                    >
                      CDSL
                    </Label>
                    <Switch
                      id="cdsl"
                      checked={values.cdsl}
                      onCheckedChange={(checked) =>
                        setFieldValue('cdsl', checked)
                      }
                    />
                  </div>

                  <div>
                    <Separator className="my-4 h-[1px] bg-muted" />
                  </div>

                  {/* Coming Soon Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="comingSoon"
                      className="text-muted-foreground w-[150px]"
                    >
                      Coming Soon
                    </Label>
                    <Switch
                      id="comingSoon"
                      checked={values.comingSoon}
                      onCheckedChange={(checked) =>
                        setFieldValue('comingSoon', checked)
                      }
                    />
                  </div>

                  {/* Sold Out Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="soldOut"
                      className="text-muted-foreground w-[150px]"
                    >
                      Sold Out
                    </Label>
                    <Switch
                      id="soldOut"
                      checked={values.soldOut}
                      onCheckedChange={(checked) =>
                        setFieldValue('soldOut', checked)
                      }
                    />
                  </div>
                  {/* Only Few Left Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="onlyFewLeft"
                      className="text-muted-foreground w-[150px]"
                    >
                      Only Few Left
                    </Label>
                    <Switch
                      id="onlyFewLeft"
                      checked={values.onlyFewLeft}
                      onCheckedChange={(checked) =>
                        setFieldValue('onlyFewLeft', checked)
                      }
                    />
                  </div>
                  <div>
                    <Separator className="my-4 h-[1px] bg-muted" />
                  </div>
                  {/* Open Active Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="openActive"
                      className="text-muted-foreground w-[150px]"
                    >
                      Open Active
                    </Label>
                    <Switch
                      id="openActive"
                      checked={values.openActive}
                      onCheckedChange={(checked) =>
                        setFieldValue('openActive', checked)
                      }
                    />
                  </div>

                  {/* Open Spotlight Switch */}
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="openSpotlight"
                      className="text-muted-foreground w-[150px]"
                    >
                      Open Spotlight
                    </Label>
                    <Switch
                      id="openSpotlight"
                      checked={values.openSpotlight}
                      onCheckedChange={(checked) =>
                        setFieldValue('openSpotlight', checked)
                      }
                    />
                  </div>

                  {/* Open Sequence No */}
                  <div className="flex items-center justify-between gap-4">
                    <Label
                      htmlFor="openSequenceNo"
                      className="text-muted-foreground w-[150px]"
                    >
                      Open Sequence No
                    </Label>
                    <Field name="openSequenceNo">
                      {({ field }) => (
                        <Input
                          {...field}
                          id="openSequenceNo"
                          type="number"
                          placeholder="sequence no"
                          className={cn(
                            errors.openSequenceNo && touched.openSequenceNo
                              ? 'border-red-500'
                              : '',
                            'w-[300px] rounded'
                          )}
                        />
                      )}
                    </Field>
                    {errors.openSequenceNo && touched.openSequenceNo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.openSequenceNo}
                      </p>
                    )}
                  </div>
                </div>
                {/* Submit Button */}
                <div className="sticky bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t shadow-lg">
                  <div className="max-w-screen-xl mx-auto py-3 flex items-center justify-between">
                    <Button
                      type="submit"
                      className="shadow-md hover:shadow-lg transition-shadow"
                    >
                      Update
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/private-equity/${assetId}`)}
                    >
                      Update more details
                    </Button>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      )}
    </SheetContent>
  )
}

export default EquityDetailsForm
