'use client'
import Image from 'next/image'
import { useState } from 'react'

import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/forms/Login'
import PostLogin from '@/components/forms/ConfirmLogin'

interface LoginData {
  phone: string
  password: string
}

const Footer = () => (
  <div className="m-4">
    <p className="mt-8 text-sm text-muted-foreground font-normal text-center">
      Precize Partner Dashboard
    </p>
    <p className="mt-4 text-sm text-muted-foreground font-normal text-center">
      Precize © 2023 <br /> All rights reserved
    </p>
  </div>
)
export default function AuthenticationPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [loginData, setLoginData] = useState<LoginData>({
    phone: '',
    password: '',
  })

  const handleLoginSuccess = (data: LoginData) => {
    setLoginData(data)
    setIsLoggedIn(true)
  }

  const handleConfirm = () => {
    setLoginData({ phone: '', password: '' })
    toast({
      title: 'Login Successful',
    })
    router.replace('/')
  }
  const handleBack = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/onboarding_ship.avif"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
      </div>
      {/* Main Flex Layout */}
      <div className="flex flex-col md:flex-row h-[100vh]">
        {/* Left side with Image */}
        <div className="relative hidden md:flex flex-1 flex-col bg-muted text-white p-10">
          <Image
            src="/onboarding_ship.avif"
            alt="Container"
            fill
            style={{ objectFit: 'cover' }}
            className="absolute inset-0 z-0"
          />
          <div className="relative z-10 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Precize
          </div>
          <div className="relative z-10 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">{/* Can add some text here */}</p>
              <footer className="text-sm">
                {/* can add some text here */}
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Right side with Form */}
        <div className="flex flex-col justify-center items-center p-8">
          <div className="flex w-full flex-col justify-center space-y-6 sm:w-[430px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Precize</h1>
              <p className="text-sm text-muted-foreground">
                Log in to your account
              </p>
            </div>
            {!isLoggedIn ? (
              <LoginForm onSuccess={handleLoginSuccess} />
            ) : (
              <PostLogin
                confirmLogin={handleConfirm}
                handleBack={handleBack}
                loginData={loginData}
              />
            )}
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
