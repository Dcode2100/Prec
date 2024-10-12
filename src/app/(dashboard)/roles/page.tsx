'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { FilterIcon, Plus, RotateCcw } from 'lucide-react'

import FilterDrawer from './components/filterDrawer'
import { PermissionRole, RolesParams } from '@/lib/types/dashboardUserType'
import { getAllRoles } from '@/lib/api/dashboardUsersApi'
import { useRouter } from 'next/navigation'
import CreateRole from './components/RoleDetailsModal'
import { columnsForRoles } from './components/columns'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'

const RolesPage = () => {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [selectedRole, setSelectedRole] = useState<PermissionRole | null>(null)
  const [roleModal, setRoleModal] = useState(false)
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
  const getColumns = () => {
    return [
      ...columnsForRoles(),
      {
        id: 'view',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="" className="text-sm" />
        ),
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 flex items-center gap-2 text-highlight-blue"
            onClick={(e) => {
              e.stopPropagation()
              router.push(`/roles/${row.original.id}`)
            }}
          >
            View Accounts
          </Button>
        ),
      },
      {
        id: 'edit',
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Actions"
            className="text-sm"
          />
        ),
        cell: ({ row }) => (
          <Button
            className="h-8 flex items-center gap-2 bg-highlight-blue text-background"
            onClick={(e) => {
              e.stopPropagation()
              setSelectedRole(row.original)
              setRoleModal(true)
            }}
          >
            Edit
          </Button>
        ),
      },
    ]
  }

  const getFilteredData = () => {
    return roles?.roles || []
  }
  const { data: roles } = useQuery({
    queryKey: ['dashboard-roles'],
    queryFn: () => fetchRoles(),
  })

  const fetchRoles = async () => {
    const params: RolesParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      created_after: dateFilter.startDate?.toISOString(),
      created_before: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    const data = await getAllRoles(params)
    return data
  }
  const handleApplyFilter = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }
  const {
    data: dashboardUsers,
    isLoading,
    refetch: refetch,
  } = useQuery({
    queryKey: ['roles', pagination, dateFilter, search],
    queryFn: () => fetchRoles(),
  })

  const resetFilters = () => {
    setSearch('')
    setDateFilter({ startDate: null, endDate: null })
    setPagination({ common: { limit: 10, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    dateFilter.startDate !== null ||
    dateFilter.endDate !== null ||
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
      <CreateRole
        isOpen={roleModal}
        role={selectedRole}
        onClose={() => setRoleModal(false)}
        refetch={refetch}
      />
      <h1 className="text-3xl font-semibold ">Roles</h1>
      <div className="w-full flex flex-col sm:flex-row justify-end items-start sm:items-center gap-4 ">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              setRoleModal(true)
              setSelectedRole(null)
            }}
            size="sm"
            variant="outline"
            className="h-8 flex items-center gap-2"
          >
            <Plus size={16} />
            Create Role
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
          columns={getColumns() as ColumnDef<PermissionRole>[]}
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
        />
      </div>
    </div>
  )
}

export default RolesPage
