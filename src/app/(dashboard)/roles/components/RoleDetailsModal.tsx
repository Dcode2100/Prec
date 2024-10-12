import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useToast } from '@/hooks/use-toast'
import { createRole, updateRole } from '@/lib/api/dashboardUsersApi'
import { PermissionRole } from '@/lib/types/dashboardUserType'
import { cn } from '@/lib/utils'

const RoleDetails = ({
  isOpen,
  onClose,
  role,
  refetch,
}: {
  isOpen: boolean
  onClose: () => void
  role: PermissionRole | null
  refetch: () => void
}): React.ReactElement => {
  const { toast } = useToast()

  const formik = useFormik({
    initialValues: {
      name: role?.name || '',
      dashboard: role?.dashboard || false,
      accounts: role?.accounts || false,
      manager: role?.manager || false,
      journey: role?.journey || false,
      orders: role?.orders || false,
      transactions: role?.transactions || false,
      accounting: role?.accounting || false,
      reports: role?.reports || false,
      cms: role?.cms || false,
      dashboard_users: role?.dashboard_users || false,
      config: role?.config || false,
      roles: role?.roles || false,
    },
    enableReinitialize: true,
    validate: (values) => {
      const errors: { name?: string } = {}
      if (!values.name.trim()) {
        errors.name = 'Role name is required'
      }
      return errors
    },
    onSubmit: async (values) => {
      try {
        const response = role?.id
          ? await updateRole(role.id, values)
          : await createRole(values)

        if (response.message) {
          toast({
            variant: 'success',
            description: response.message,
          })

          onClose()
          refetch()
        }
      } catch (err) {
        toast({
          variant: 'destructive',
          description: `${role?.id ? 'Update' : 'Create'} Failed`,
        })
      }
    },
  })

  const renderFormField = (name: string, label: string) => (
    <div className="w-full sm:w-1/2 px-2 mb-4">
      {name === 'name' ? (
        <>
          <Label htmlFor={name} className="block mb-2">
            {label} <span className="text-red-500">*</span>
          </Label>
          <Input
            id={name}
            name={name}
            value={formik.values[name as keyof typeof formik.values] as string}
            onChange={formik.handleChange}
            className={cn(
              'w-full',
              formik.errors.name && formik.touched.name ? 'border-red-500' : ''
            )}
          />
          {formik.errors.name && formik.touched.name && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.name}
            </div>
          )}
        </>
      ) : (
        <div
          className={cn(
            'flex items-center justify-center p-2 rounded-md cursor-pointer transition-all text-sm',
            formik.values[name as keyof typeof formik.values]
              ? 'bg-green-50 border-2 border-highlight-green text-highlight-green font-medium'
              : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200 text-gray-600'
          )}
          onClick={() =>
            formik.setFieldValue(
              name,
              !formik.values[name as keyof typeof formik.values]
            )
          }
        >
          {label}
        </div>
      )}
    </div>
  )

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Role Details</SheetTitle>
          <SheetDescription>
            {role?.id ? 'Update' : 'Create'} role details
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={formik.handleSubmit} className="py-4">
          <div className="w-full mb-4">{renderFormField('name', 'Name')}</div>
          <Separator className="my-4" />
          <div className="flex flex-wrap -mx-2">
            {renderFormField('dashboard', 'Dashboard')}
            {renderFormField('accounts', 'Accounts')}
            {renderFormField('manager', 'Manager')}
            {renderFormField('journey', 'Journey')}
            {renderFormField('orders', 'Orders')}
            {renderFormField('transactions', 'Transactions')}
            {renderFormField('accounting', 'Accounting')}
            {renderFormField('reports', 'Reports')}
            {renderFormField('cms', 'CMS')}
            {renderFormField('dashboard_users', 'Users')}
            {renderFormField('config', 'Config')}
            {renderFormField('roles', 'Roles')}
          </div>
          <Button type="submit" className="w-full mt-4">
            {role?.id ? 'Update' : 'Create'} Role
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}

export default RoleDetails
