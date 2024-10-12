'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { RotateCcw, Copy } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { columnsForUser } from '../components/columns'
import { useToast } from '@/hooks/use-toast'
import { copyToClipboard } from '@/components/CopyCell'
import { DashboardUsersParams } from '@/lib/types/dashboardUserType'
import { useParams } from 'next/navigation'
import {
  deleteDashboardUser,
  getAllAccountsByRoleId,
  logoutDashboardUser,
} from '@/lib/api/dashboardUsersApi'
import { getGlobalItem } from '@/utils/utils'
import { RoleAccounts } from '@/lib/types/dashboardUserType'

export const ActionButton = ({ row }: { row: RoleAccounts }) => {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const copyResponseToClipboard = (key: string) => {
    const jsonString = JSON.stringify(row[key])
    copyToClipboard(jsonString)
    toast({
      title: 'Copied to clipboard',
      description: `${key} has been copied to your clipboard.`,
      variant: 'success',
      duration: 3000,
    })
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button className="h-8 px-2 bg-highlight-blue flex items-center gap-1">
          <span className="sr-only">Open menu</span>
          <span className="text-xs">Copy</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 mr-20">
        <div className="grid gap-1">
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('device_info')}
          >
            Device info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('req')}
          >
            Request Info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
          <Button
            className="w-full justify-start text-xs py-1 group"
            variant="ghost"
            onClick={() => copyResponseToClipboard('res')}
          >
            Response Info
            <Copy
              size={14}
              className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

const DashboardEventsPage = () => {
  const { slug } = useParams()
  const [search, setSearch] = useState('')
  const { toast } = useToast()
  const [isLoadingUserIDs, setIsLoadingUserIDs] = useState<string[]>([])
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })

  async function handleUserLogout(userId: string) {
    setIsLoadingUserIDs((prev) => [...prev, userId])

    try {
      const response = await logoutDashboardUser(userId)

      if (response?.statusCode === 200) {
        toast({
          title: response.message,
          variant: 'success',
        })
        refetch()
      } else {
        throw new Error(response?.message || 'Logout failed')
      }
    } catch (error) {
      console.error('User logout error:', error)
      toast({
        title: 'User logout failed',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingUserIDs((prev) => prev.filter((id) => id !== userId))
    }
  }
  async function handleDeleteUser(userId: string) {
    try {
      setIsLoadingUserIDs((prev) => [...prev, userId])
      const response = await deleteDashboardUser(userId, { soft: false })

      if (response.statusCode === 200) {
        refetch()
        toast({
          title: response.message,
          variant: 'success',
        })
      } else {
        throw new Error(response.message || 'Delete failed')
      }
    } catch (error) {
      toast({
        title: 'User deletion failed',
        variant: 'destructive',
      })
    } finally {
      setIsLoadingUserIDs((prev) => prev.filter((id) => id !== userId))
    }
  }

  const getFilteredData = () => {
    return accountsByRoleId?.accounts || []
  }

  const getColumns = () => {
    return columnsForUser({
      isDashboardAdminUser: true,
      dashboardAccountId: getGlobalItem('dashboard-account-id'),
      onUserLogout: handleUserLogout,
      onUserDelete: handleDeleteUser,
      isLoadingUserIDs: isLoadingUserIDs,
    })
  }
  const fetchOrder = async () => {
    const params: DashboardUsersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }

    const data = await getAllAccountsByRoleId(slug as string, params)
    return data
  }
  const {
    data: accountsByRoleId,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [`role-accounts-${slug}`, pagination, search],
    queryFn: () => fetchOrder(),
  })

  const resetFilters = () => {
    setSearch('')
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  const renderUserName = () => {
    if (isLoading) {
      return (
        <span className="text-muted-foreground text-lg">
          Loading user details...
        </span>
      )
    }

    if (!accountsByRoleId?.accounts.length) {
      return (
        <span className="text-gray-400 text-lg">
          No accounts found for this role
        </span>
      )
    }

    const { name } = accountsByRoleId.role
    return (
      <span className="text-highlight-blue text-3xl font-semibold">
        {name}&apos;s accounts
      </span>
    )
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <div className="mb-4">{renderUserName()}</div>
      <div className="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 ">
        <div className="flex flex-wrap items-center gap-3">
          {isFiltered && (
            <Button
              onClick={resetFilters}
              size="sm"
              variant="outline"
              className="h-8 flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </Button>
          )}
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<RoleAccounts>[]}
          data={getFilteredData()}
          enableSearch={true}
          enableDropdown={false}
          search={search}
          onSearchChange={setSearch}
          page={pagination.common.page}
          limit={pagination.common.limit}
          onPageChange={(page) => {
            setPagination((prev) => ({
              ...prev,
              common: { ...prev.common, page },
            }))
          }}
          onRowChange={(limit) => {
            setPagination((prev) => ({
              ...prev,
              common: { ...prev.common, limit },
            }))
          }}
          filter={''}
          onChangeFilter={() => {}}
          total={accountsByRoleId?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
    </div>
  )
}

export default DashboardEventsPage
