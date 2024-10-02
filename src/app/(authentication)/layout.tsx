'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { getGlobalItem } from '@/utils/utils'

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const isLoggedIn =
    getGlobalItem('chace-app-key') && getGlobalItem('dashboard-account-id')

  if (isLoggedIn) {
    router.replace('/')
  }
  if (isLoggedIn) return null

  return (
    <div className="bg-light dark:bg-dark min-vh-100 d-flex flex-row align-items-center">
      {children}
    </div>
  )
}
