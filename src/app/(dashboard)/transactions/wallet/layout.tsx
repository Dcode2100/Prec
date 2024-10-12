'use client'
import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import BreadCrumbs from '@/components/BreadCrumbs'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import AllTransactions from '@/app/(dashboard)/transactions/wallet/page'
import DebitTransactions from '@/components/WalletPages/DebitTransactions'
import CreditTransactions from '@/components/WalletPages/CreditTransactions'


const WALLET_NAVIGATION = [
  { text: 'All', value: 'all' },
  { text: 'Credit', value: 'credit' },
  { text: 'Debit', value: 'debit' },
]

const WalletTransactionsLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const pathname = usePathname()
  const [currentTab, setCurrentTab] = useState('all')

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const breadcrumbs = [
      { href: '/transactions', label: 'Transactions' },
      { href: '/transactions/wallet', label: 'Wallet' },
    ]

    if (paths.length > 2) {
      const currentPageName = paths[paths.length - 1]
      breadcrumbs.push({
        href: pathname,
        label:
          currentPageName.charAt(0).toUpperCase() +
          currentPageName.slice(1).replace(/-/g, ' '),
      })
    }
    return breadcrumbs
  }

  const handleTabChange = (value: string) => {
    setCurrentTab(value)
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'credit':
        return <CreditTransactions />
      case 'debit':
        return <DebitTransactions />
      default:
        return children
    }
  }

  return (
    <div className="w-full h-full rounded-lg flex flex-col gap-4">
      <div className="flex h-min justify-between">
        <Tabs value={currentTab} onValueChange={handleTabChange}>
          <TabsList>
            {WALLET_NAVIGATION.map((item, index) => (
              <TabsTrigger
                key={index}
                value={item.value}
                className="relative group"
              >
                {item.text}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <BreadCrumbs items={getBreadcrumbs()} />

      <div className="wallet-transactions-content-layout h-[calc(100vh-100px)] overflow-y-auto bg-background rounded-lg mb-2 p-2">
        {renderContent()}
      </div>
    </div>
  )
}

export default WalletTransactionsLayout