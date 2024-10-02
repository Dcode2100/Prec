'use client'
import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import DASHBOARD_NAVIGATION from '@/constants/accountSlugNavitems'
import BreadCrumbs from '@/components/BreadCrumbs'
import UpdateAccount from '@/components/forms/UpdateAccount'
import { getAccount } from '@/lib/api/accountApi'
import { Button } from '@/components/ui/button'
import { usePathname } from 'next/navigation'
import Loader from '@/components/Loader'

interface TabType {
  href?: string
  text: string
  subTabs?: TabType[]
}

const NavItem = ({ item, level = 0 }: { item: TabType; level?: number }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { slug } = useParams()

  const handleMouseEnter = () => setIsHovered(true)
  const handleMouseLeave = () => setIsHovered(false)
  const handleClick = () => setIsHovered(false) // Added to close the hover on click

  return (
    <li
      className={`relative group ${level === 0 ? 'px-4' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.href ? item.href.replace('[slug]', slug as string) : '#'}
        className={`block py-2 text-sm ${
          level === 0
            ? 'hover:text-accent-foreground'
            : 'px-4 hover:bg-accent hover:text-accent-foreground rounded-md'
        }`}
      >
        {item.text}
      </Link>

      {item.subTabs && (
        <div
          className={`absolute ${
            level === 0 ? 'left-0 ' : 'left-full top-0 '
          } ${isHovered ? 'block' : 'hidden'}   z-20`}
          onClick={handleClick}
        >
          <div className="bg-popover text-popover-foreground rounded-md shadow-lg p-2 w-48">
            <ul>
              {item.subTabs.map((subItem, subIndex) => (
                <NavItem key={subIndex} item={subItem} level={level + 1} />
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}

const AccountLayout = ({ children }: { children: React.ReactNode }) => {
  const { slug } = useParams()
  const pathname = usePathname()
  const [openUpdateAccountModal, setOpenUpdateAccountModal] = useState(false)
  const [isChange, setIsChange] = useState(false)

  const {
    data: account,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['account', slug],
    queryFn: async () => {
      if (typeof slug === 'string') {
        const parts = slug.split('-')
        const accountType = parts[0]
        const accountId = parts.slice(1).join('-')

        if (accountType && accountId) {
          return await getAccount(accountType, accountId)
        }
      }
      return null
    },
    enabled: !!slug,
  })

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    const isRootAccountPage = paths.length === 2 // ['accounts', '[slug]']

    if (isRootAccountPage) {
      return [
        { href: '/accounts', label: 'Accounts' },
        { href: pathname, label: 'Overview' },
      ]
    } else {
      const currentPageName = paths[paths.length - 1]
      return [
        { href: '/accounts', label: 'Accounts' },
        { href: `/accounts/${slug}`, label: 'Overview' },
        {
          href: pathname,
          label:
            currentPageName.charAt(0).toUpperCase() + currentPageName.slice(1),
        },
      ]
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (!account) {
    return <div>Account not found</div>
  }

  return (
    <div className="w-full h-full rounded-lg  flex flex-col gap-4">
      <div className="flex h-min justify-between ">
        <nav className="bg-card text-card-foreground rounded-lg w-min">
          <ul className="flex">
            {DASHBOARD_NAVIGATION.map((item, index) => (
              <NavItem key={index} item={item} />
            ))}
          </ul>
        </nav>
        {pathname.startsWith('/orders') ? null : (
          <Button onClick={() => setOpenUpdateAccountModal(true)}>
            Update Account
          </Button>
        )}

        <UpdateAccount
          isOpen={openUpdateAccountModal}
          onClose={() => {
            setOpenUpdateAccountModal(false)
            refetch()
          }}
          account={account}
          isChange={isChange}
          setIsChange={setIsChange}
        />
      </div>

      <BreadCrumbs items={getBreadcrumbs()} />

      <div className="Account-slug-content-layout h-[calc(100vh-100px)] overflow-y-auto bg-background rounded-lg p-4 mb-2">
        {children}
      </div>
    </div>
  )
}

export default AccountLayout
