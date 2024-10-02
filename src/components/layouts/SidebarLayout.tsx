'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/Sidebar'
import { Icons } from '@/components/icons'
import { defaultAdminMenuItems } from '@/constants/navItems'

type SidebarProps = {
  className?: string
}

export default function SidebarLayout({ className }: SidebarProps) {
  const [isMinimized, setIsMinimized] = useState(true)
  const [navOpened, setNavOpened] = useState(true)

  useEffect(() => {
    if (navOpened) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  }, [navOpened])

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full border-r border-accent select-none bg-card transition-[width] duration-300 md:bottom-0 md:right-auto md:h-svh`,
        isMinimized ? 'md:w-[72px]' : 'md:w-72',
        className
      )}
      onMouseEnter={() => setIsMinimized(false)}
      onMouseLeave={() => setIsMinimized(true)}
    >
      <div
        onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-500 ${
          navOpened ? 'h-svh opacity-50' : 'h-0 opacity-0'
        } w-full bg-black md:hidden`}
      />

      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center p-5 pt-10">
          <Link
            href="/"
            className={`transition-all ${
              isMinimized ? 'w-6 h-6' : 'w-auto flex gap-4 items-center'
            }`}
          >
            <Icons.logo className="h-6 w-6" />
            <span
              className={cn(
                'text-[20px] transition-opacity duration-200 ease-in-out',
                isMinimized ? 'opacity-0' : 'opacity-100'
              )}
              style={{
                visibility: isMinimized ? 'hidden' : 'visible', // Ensure it's removed from flow when minimized
              }}
            >
              Precize
            </span>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <Icons.close /> : <Icons.close />}
          </Button>
        </div>

        <div
          className={`flex-1 overflow-auto ${
            navOpened ? 'max-h-screen' : 'max-h-0 py-0 md:max-h-screen md:py-2'
          }`}
        >
          <Sidebar
            defaultAdminMenuItems={defaultAdminMenuItems}
            isMinimized={isMinimized}
            setOpen={setNavOpened}
            isMobileNav={false}
          />
        </div>

        {/* <Button
          onClick={handleToggle}
          size="icon"
          variant="outline"
          className="absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
        >
          <Icons.chevronLeft className={cn('h-4 w-4', isMinimized && 'rotate-180')} />
        </Button> */}
      </div>
    </aside>
  )
}
