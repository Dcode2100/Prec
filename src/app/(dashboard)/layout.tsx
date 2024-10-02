'use client'

import { ReactNode } from 'react'
import SidebarLayout from '@/components/layouts/SidebarLayout'
import Header from '@/components/header'
import { useRouter } from 'next/navigation'
import { getGlobalItem } from '@/utils/utils'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter()

  const isLoggedIn =
    getGlobalItem('chace-app-key') && getGlobalItem('dashboard-account-id')

  if (!isLoggedIn) {
    router.replace('/login')
  }
  if (!isLoggedIn) return null

  return (
    <div className="dashboard-layout relative flex w-full h-screen">
      <div className="w-[72px]">
        <SidebarLayout />
      </div>
      <div className="main-content h-full min-w-[calc(100%-72px)] flex items-center flex-col">
        <Header />
        <main className="h-[calc(100vh-70px)] w-full pt-1 px-2 relative overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
