import React, { useState, useRef } from 'react'
import * as Yup from 'yup'
import { useForm, FormProvider } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormLabel,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Eye, EyeOff } from 'lucide-react'
import {
  confirmSignUp,
  resendCodeForSignup,
  signup,
} from '@/lib/api/dashboardUsersApi'
import { encrypt } from '@/utils/helper'
import { useToast } from '@/hooks/use-toast'
import { yupResolver } from '@hookform/resolvers/yup'

interface SignupModalProps {
  open: boolean
  onClose: () => void
  usersQuery: () => void
}

const SignupModal = ({ open, onClose, usersQuery }: SignupModalProps) => {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isConfirm, setIsConfirm] = useState(false)
  const [accountId, setAccountId] = useState('')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required('First name is required'),
    last_name: Yup.string().required('Last name is required'),
    phone: Yup.string().required('Phone is required'),
    password: Yup.string().required('Password is required'),
  })

  const methods = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
    },
    resolver: yupResolver(validationSchema),
  })

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = methods

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const requestData = {
        ...data,
        password: encrypt(data.password),
      }
      const response = await signup(requestData)
      setAccountId(response.data.account_id)
      setPhone(data.phone)
      setIsConfirm(true)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Signup failed',
        description: 'Please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirm = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    try {
      await confirmSignUp(accountId, code)
      toast({
        title: 'Signup Successful',
        description: 'You can now login',
      })
      usersQuery()
      handleClose()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Confirmation failed, please try again',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeResend = async () => {
    setIsLoading(true)
    try {
      await resendCodeForSignup(accountId)
      toast({
        title: 'Code Resent',
        description: 'Please check your phone for the code',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to resend code',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    onClose()
    setIsConfirm(false)
    reset()
    setCode('')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isConfirm ? 'Confirm' : 'Sign Up'}</DialogTitle>
        </DialogHeader>

        <FormProvider {...methods}>
          {isConfirm ? (
            <form onSubmit={handleConfirm}>
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input value={phone} placeholder="Phone number" />
                </FormControl>
              </FormItem>

              <FormItem>
                <FormLabel>Confirmation Code</FormLabel>
                <FormControl>
                  <Input
                    ref={inputRef}
                    value={code}
                    placeholder="Enter code"
                    onChange={(e) => setCode(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleCodeResend}
                  disabled={isLoading}
                >
                  Resend Code
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Confirm
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter first name"
                    {...register('first_name')}
                  />
                </FormControl>
                <FormMessage>{errors.first_name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter last name"
                    {...register('last_name')}
                  />
                </FormControl>
                <FormMessage>{errors.last_name?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone" {...register('phone')} />
                </FormControl>
                <FormMessage>{errors.phone?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      {...register('password')}
                    />
                    <Button
                      variant="ghost"
                      type="button"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage>{errors.password?.message}</FormMessage>
              </FormItem>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="mt-4">
                  Sign Up
                </Button>
              </div>
            </form>
          )}
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default SignupModal
