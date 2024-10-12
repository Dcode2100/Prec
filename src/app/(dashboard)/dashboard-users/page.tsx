'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, Plus, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

import FilterDrawer from './components/filterDrawer'
import {
  DashboardUser,
  DashboardUsersParams,
} from '@/lib/types/dashboardUserType'
import { columnsForDashboardUsers } from './components/columns'
import { getGlobalItem } from '@/utils/utils'
import {
  deleteDashboardUser,
  getAllDashboardUsers,
  getAllRoles,
  logoutDashboardUser,
  updateDashboardUser,
} from '@/lib/api/dashboardUsersApi'
import { useRouter } from 'next/navigation'
import CreateUser from './components/CreateUser'

const DashboardUsersPage = () => {
  const { toast } = useToast()
  const router = useRouter()
  const [createModal, setCreateModal] = useState(false)
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })
  const [filters, setFilters] = useState<{
    verified: string
  }>({
    verified: 'all',
  })
  const [isLoadingUserIDs, setIsLoadingUserIDs] = useState<string[]>([])
  const getColumns = () => {
    return columnsForDashboardUsers({
      roles: roles?.roles || [],
      types: ['USER', 'ADMIN'],
      isDashboardAdminUser: true,
      dashboardAccountId: getGlobalItem('dashboard-account-id'),
      onUserUpdate: handleDashboardUserUpdate,
      onUserLogout: handleUserLogout,
      onUserDelete: handleDeleteUser,
      isLoadingUserIDs: isLoadingUserIDs,
    })
  }

  const getFilteredData = () => {
    return dashboardUsers?.dashboard_users || []
  }
  const fetchRoles = async () => {
    const data = await getAllRoles()
    return data
  }
  const { data: roles } = useQuery({
    queryKey: ['dashboard-roles'],
    queryFn: () => fetchRoles(),
  })

  const fetchOrder = async () => {
    const params: DashboardUsersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    if (filters.verified !== 'all') {
      params.verified = filters.verified === 'true'
    }
    const data = await getAllDashboardUsers(params)
    return data
  }
  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null,
    verified: string
  ) => {
    setDateFilter({ startDate, endDate })
    setFilters({ verified })
  }
  const {
    data: dashboardUsers,
    isLoading,
    refetch: usersQuery,
  } = useQuery({
    queryKey: ['dashboard-users', pagination, dateFilter, search, filters],
    queryFn: () => fetchOrder(),
  })

  async function handleDashboardUserUpdate(
    event: string,
    user: DashboardUser,
    updateFor: 'role' | 'type'
  ) {
    try {
      const requestBody: { role_id?: string; type?: string } = {}

      if (updateFor === 'role') {
        requestBody.role_id = event
      } else {
        requestBody.type = event
      }

      const response = await updateDashboardUser(user.account_id, requestBody)

      if (response.statusCode === 200) {
        await usersQuery()
        toast({
          title: response.message,
          variant: 'success',
        })
      } else {
        throw new Error(response.message || 'Update failed')
      }
    } catch (err) {
      toast({
        title: `${
          updateFor.charAt(0).toUpperCase() + updateFor.slice(1)
        } assigning failed`,
        variant: 'destructive',
      })
    }
  }
  async function handleUserLogout(userId: string) {
    setIsLoadingUserIDs((prev) => [...prev, userId])

    try {
      const response = await logoutDashboardUser(userId)

      if (response?.statusCode === 200) {
        toast({
          title: response.message,
          variant: 'success',
        })
        await usersQuery()
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
        await usersQuery()
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

  const resetFilters = () => {
    setSearch('')
    setFilters({ verified: 'all' })
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
    filters.verified !== 'all' ||
    pagination.common.limit !== 10 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <FilterDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Filter Options"
        onApplyFilter={handleApplyFilter}
      />
      <CreateUser
        open={createModal}
        onClose={() => setCreateModal(false)}
        usersQuery={usersQuery}
      />
      <h1 className="text-3xl font-semibold ">Dashboard Users</h1>
      <div className="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 ">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => setCreateModal(true)}
            size="sm"
            variant="outline"
            className="h-8 flex items-center gap-2"
          >
            <Plus size={16} />
            Create User
          </Button>
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
          <Button
            size="sm"
            variant="outline"
            onClick={() => setOpenDrawer(true)}
            className="h-8 flex items-center gap-2"
          >
            <FilterIcon size={16} />
            Filter
          </Button>
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<DashboardUser>[]}
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
          total={dashboardUsers?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={(row) => {
            router.push(`/dashboard-users/${row.account_id}`)
          }}
        />
      </div>
    </div>
  )
}

export default DashboardUsersPage
