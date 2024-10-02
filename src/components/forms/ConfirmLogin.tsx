import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import authApi from '@/lib/api/authapi'
import { encrypt } from '@/utils/helper'
import { useAppDispatch } from '@/lib/redux/hooks'
import { login } from '@/lib/redux/slices/userSlice'

const schema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
    .required('OTP is required'),
})

interface IFormInput {
  otp: string
}

interface LoginData {
  phone: string
  password: string
}

interface PostLoginProps {
  confirmLogin: () => void
  loginData: LoginData
  handleBack: () => void
}

const PostLogin: React.FC<PostLoginProps> = ({
  confirmLogin,
  loginData,
  handleBack,
}) => {
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false) // Loading state

  const form = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      otp: '',
    },
  })

  const onSubmit = async (data: IFormInput) => {
    setIsLoading(true)
    try {
      const response = await authApi.confirmOtp(
        data.otp,
        encrypt(loginData.password),
        'CHACE'
      )
      if (response?.status === 200) {
        dispatch(login({ ...response.data.data }))
        confirmLogin()
      }
    } catch (error) {
      // console.error('OTP confirmation error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="mb-8">
          <FormField
            control={form.control}
            name="otp"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Enter OTP</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    maxLength={6}
                    placeholder="Enter 6-digit OTP"
                    className="h-12 text-md"
                    disabled={isLoading} // Disable input while loading
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? 'Loading...' : 'Log in'} {/* Show loading text */}
        </Button>
        <Button
          onClick={handleBack}
          className="w-full mt-4"
          variant="outline"
          disabled={isLoading} // Disable cancel button while loading
        >
          Cancel
        </Button>
      </form>
    </Form>
  )
}

export default PostLogin
