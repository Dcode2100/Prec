'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { cn } from '@/lib/utils'
import { Icons } from '@/components/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip'
import { Dispatch, SetStateAction } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

interface SidebarProps {
  defaultAdminMenuItems: typeof import('@/constants/navItems').defaultAdminMenuItems
  setOpen?: Dispatch<SetStateAction<boolean>>
  isMobileNav?: boolean
  isMinimized: boolean
}

export function Sidebar({
  defaultAdminMenuItems,
  setOpen,
  isMobileNav = false,
  isMinimized,
}: SidebarProps) {
  const path = usePathname()
  const [openDropdowns, setOpenDropdowns] = useState<{
    [key: string]: boolean
  }>({})

  if (!defaultAdminMenuItems?.length) {
    return null
  }

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <nav className="grid items-start gap-2 px-3 py-2 ">
      <TooltipProvider>
        {defaultAdminMenuItems.map((item) => {
          const IconComponent =
            Icons[item.icon as keyof typeof Icons] || Icons.help
          return (
            <Tooltip key={item.key}>
              <TooltipTrigger asChild>
                {item.isDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(item.key)}
                      className={cn(
                        'flex items-center justify-between w-full gap-2 rounded-md flex-row py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground pr-3',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <IconComponent className="ml-3 h-5 w-5 flex-none" />
                        {isMobileNav || (!isMinimized && !isMobileNav) ? (
                          <span className="mr-2 truncate">{item.header}</span>
                        ) : null}
                      </div>
                      <div>
                        {!isMinimized &&
                          (openDropdowns[item.key] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          ))}
                      </div>
                    </button>
                    
                    {openDropdowns[item.key] && !isMinimized && (
                      <div className="ml-8 mt-2 ">
                        {item.category.map((subItem) => (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            className="block py-2 px-4 text-sm hover:bg-accent rounded-md"
                            onClick={() => {
                              if (setOpen) setOpen(false)
                            }}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.path || '/'}
                    className={cn(
                      'flex items-center gap-2 rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ',
                      path === item.path ? 'bg-accent' : 'transparent'
                    )}
                    onClick={() => {
                      if (setOpen) setOpen(false)
                    }}
                  >
                    <IconComponent className="ml-3 h-5 w-5 flex-none" />
                    {isMobileNav || (!isMinimized && !isMobileNav) ? (
                      <span className="mr-2 truncate">{item.header}</span>
                    ) : null}
                  </Link>
                )}
              </TooltipTrigger>
              <TooltipContent
                align="center"
                side="right"
                sideOffset={8}
                className={!isMinimized ? 'hidden' : 'inline-block'}
              >
                {item.header}
              </TooltipContent>
            </Tooltip>
          )
        })}
      </TooltipProvider>
    </nav>
  )
}
