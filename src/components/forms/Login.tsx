'use client'

import * as React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { encrypt } from '@/utils/helper'
import authApi from '@/lib/api/authapi'
import { cn } from '@/lib/utils'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Eye, EyeOff } from 'lucide-react'

const schema = yup.object().shape({
  phone: yup
    .string()
    .matches(/^\+?[0-9]+$/, 'Must be only digits')
    .min(13, 'Must be exactly 13 digits')
    .max(13, 'Must be exactly 13 digits')
    .required('Mobile number is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
})

interface IFormInput {
  phone: string
  password: string
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess: (data: IFormInput) => void
}

const LoginForm = ({ className, onSuccess, ...props }: UserAuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [showPassword, setShowPassword] = React.useState<boolean>(false)

  const form = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsLoading(true)
    try {
      const response = await authApi.login(
        data.phone,
        encrypt(data.password),
        'CHACE'
      )
      if (response?.status === 200) {
        onSuccess(data)
      }
    } catch (error) {
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={13}
                    placeholder="Enter phone number"
                    className="h-12 text-md"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="h-12 text-md pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading} className="w-full h-10">
            {isLoading ? 'Loading...' : 'Next'}
          </Button>
        </form>
      </Form>
    </div>
  )
}

export default LoginForm
