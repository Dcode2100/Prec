import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { updateAnAccount } from '@/lib/api/accountApi'
import moment from 'moment'

interface UpdateAccountProps {
  isOpen: boolean
  onClose: () => void
  account: any
  isChange: boolean
  setIsChange: (value: boolean) => void
}

const UpdateAccount = ({
  isOpen,
  onClose,
  account,
  isChange,
  setIsChange,
}: UpdateAccountProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [state, setState] = useState({
    active: account?.active,
    first_name: account?.contact?.first_name?.trim(),
    middle_name: account?.contact?.middle_name?.trim(),
    last_name: account?.contact?.last_name?.trim(),
    email: account?.contact?.email?.trim(),
    mobile: account?.contact?.mobile?.trim(),
    bo_id: account?.identity?.bo_id[0]?.trim(),
    evaluation_expiry_date: account?.evaluation_expiry_date,
    referral_limit: account?.referral?.referral_limit,
    pan: account?.pan,
    nominator_code: account?.nominator?.code,
    portal_linked: account?.portal_linked,
    gender: account?.contact?.gender,
    company_name: account?.contact?.company_name?.trim(),
    designation: account?.contact?.designation?.trim(),
    city: account?.contact?.city?.trim(),
    pc_active: account?.pc_active,
  })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      const response = await updateAnAccount(account?.account_id, state)

      if (response.message) {
        toast({
          description: response.message,
        })
        setIsChange(!isChange)
        onClose()
      }
    } catch (err: any) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while updating the account.',
      })
    }
    setIsLoading(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[600px] h-full overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle>Update Account</SheetTitle>
          <div className="h-px bg-border mt-2"></div>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4 mb-20">
          <div className="flex items-center space-x-4">
            <Label htmlFor="first_name" className="w-1/3">
              First Name
            </Label>
            <Input
              id="first_name"
              name="first_name"
              defaultValue={account?.contact?.first_name}
              onChange={(e) =>
                setState({ ...state, first_name: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="middle_name" className="w-1/3">
              Middle Name
            </Label>
            <Input
              id="middle_name"
              name="middle_name"
              defaultValue={account?.contact?.middle_name}
              onChange={(e) =>
                setState({ ...state, middle_name: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="last_name" className="w-1/3">
              Last Name
            </Label>
            <Input
              id="last_name"
              name="last_name"
              defaultValue={account?.contact?.last_name}
              onChange={(e) =>
                setState({ ...state, last_name: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="email" className="w-1/3">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              defaultValue={account?.contact?.email}
              onChange={(e) => setState({ ...state, email: e.target.value })}
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="mobile" className="w-1/3">
              Mobile
            </Label>
            <Input
              id="mobile"
              name="mobile"
              defaultValue={account?.contact?.mobile}
              onChange={(e) => setState({ ...state, mobile: e.target.value })}
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="dob" className="w-1/3">
              DOB
            </Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              defaultValue={moment(account?.dob).format('YYYY-MM-DD')}
              onChange={(e) =>
                setState((prev) => ({ ...prev, dob: new Date(e.target.value) }))
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="gender" className="w-[100px]">
              Gender
            </Label>
            <Select
              defaultValue={account?.contact?.gender}
              onValueChange={(value) =>
                setState((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="company_name" className="w-1/3">
              Company Name
            </Label>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={account?.contact?.company_name}
              onChange={(e) =>
                setState({ ...state, company_name: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="designation" className="w-1/3">
              Designation
            </Label>
            <Input
              id="designation"
              name="designation"
              defaultValue={account?.contact?.designation}
              onChange={(e) =>
                setState({ ...state, designation: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="city" className="w-1/3">
              City
            </Label>
            <Input
              id="city"
              name="city"
              defaultValue={account?.contact?.city}
              onChange={(e) => setState({ ...state, city: e.target.value })}
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="bo_id" className="w-1/3">
              Demat Account
            </Label>
            <Input
              id="bo_id"
              name="bo_id"
              defaultValue={account?.identity?.bo_id[0]}
              onChange={(e) => setState({ ...state, bo_id: e.target.value })}
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="evaluation_expiry_date" className="w-1/3">
              Evaluation Expiry
            </Label>
            <Input
              id="evaluation_expiry_date"
              name="evaluation_expiry_date"
              type="date"
              defaultValue={moment(account?.evaluation_expiry_date).format(
                'YYYY-MM-DD'
              )}
              onChange={(e) =>
                setState({
                  ...state,
                  evaluation_expiry_date: new Date(e.target.value),
                })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="referral_limit" className="w-1/3">
              Referral Limit
            </Label>
            <Input
              id="referral_limit"
              name="referral_limit"
              type="number"
              defaultValue={account?.referral?.referral_limit}
              onChange={(e) =>
                setState({ ...state, referral_limit: Number(e.target.value) })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="pan" className="w-1/3">
              PAN
            </Label>
            <Input
              id="pan"
              name="pan"
              defaultValue={account?.pan}
              onChange={(e) => setState({ ...state, pan: e.target.value })}
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="nominator_code" className="w-1/3">
              Nominator Code
            </Label>
            <Input
              id="nominator_code"
              name="nominator_code"
              defaultValue={account?.nominator?.code}
              disabled={!!account?.nominator?.code}
              onChange={(e) =>
                setState({ ...state, nominator_code: e.target.value })
              }
              className="w-2/3"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="portal_linked" className="w-1/3">
              PAN Linked
            </Label>
            <div className="w-2/3">
              <Switch
                id="portal_linked"
                name="portal_linked"
                checked={state.portal_linked}
                onCheckedChange={(checked) =>
                  setState({ ...state, portal_linked: checked })
                }
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="active" className="w-1/3">
              Active
            </Label>
            <div className="w-2/3">
              <Switch
                id="active"
                name="active"
                checked={state.active}
                onCheckedChange={(checked) =>
                  setState({ ...state, active: checked })
                }
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Label htmlFor="pc_active" className="w-1/3">
              Private Credit
            </Label>
            <div className="w-2/3">
              <Switch
                id="pc_active"
                name="pc_active"
                checked={state.pc_active}
                onCheckedChange={(checked) =>
                  setState({ ...state, pc_active: checked })
                }
              />
            </div>
          </div>
        </form>
        <div className="fixed bottom-0 w-full bg-background p-4 border-t">
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className=""
          >
            {isLoading ? 'Updating...' : 'Update Account'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default UpdateAccount
