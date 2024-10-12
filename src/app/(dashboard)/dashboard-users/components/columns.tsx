'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'
import moment from 'moment'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DashboardUser } from '@/lib/types/dashboardUserType'
import CopyableCell from '@/components/CopyCell'
import { cn } from '@/lib/utils'
import { DashboardUserEvent } from '@/lib/types/dashboardUserType'
import { ReactNode } from 'react'

interface DashboardUsersColumnsProps {
  roles: { id: string; name: string }[] | null
  types: string[]
  isDashboardAdminUser: boolean
  dashboardAccountId: string
  onUserUpdate: (
    value: string,
    user: DashboardUser,
    field: 'role' | 'type'
  ) => void
  onUserLogout: (accountId: string) => void
  onUserDelete: (accountId: string) => void
  isLoadingUserIDs: string[]
}

export const columnsForDashboardUsers = ({
  roles,
  types,
  isDashboardAdminUser,
  dashboardAccountId,
  onUserUpdate,
  onUserLogout,
  onUserDelete,
  isLoadingUserIDs,
}: DashboardUsersColumnsProps): ColumnDef<DashboardUser>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sr No."
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorFn: (row) =>
      `${row.first_name || ''} ${row.last_name || ''}`.trim(),
    id: 'fullName',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Full Name"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-sm">{row.getValue('fullName') || '-'}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'phone',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Phone"
        className="text-sm"
      />
    ),
    cell: ({ row }) => <CopyableCell value={row.getValue('phone') || '-'} />,
    enableSorting: false,
  },
  {
    id: 'role',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role"
        className="text-sm text-center w-full"
      />
    ),
    cell: ({ row }) => {
      const user = row.original
      const isCurrentUser = user.account_id === dashboardAccountId

      if (!isDashboardAdminUser) {
        return (
          <div className="w-[130px] text-sm text-muted-foreground text-center">
            {(roles && roles?.find((role) => role.id === user.role_id)?.name) ||
              '-'}
          </div>
        )
      }

      if (isCurrentUser) {
        return (
          <div className="w-[130px] px-2 text-sm ">
            {(roles && roles?.find((role) => role.id === user.role_id)?.name) ||
              '-'}
          </div>
        )
      }

      return (
        <Select
          defaultValue={user.role_id}
          onValueChange={(value) => onUserUpdate(value, user, 'role')}
          disabled={isCurrentUser}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            {roles &&
              roles?.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      )
    },
    enableSorting: false,
  },
  {
    id: 'type',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Type"
        className="text-sm text-center w-full"
      />
    ),
    cell: ({ row }) => {
      const user = row.original
      const isCurrentUser = user.account_id === dashboardAccountId

      if (!isDashboardAdminUser) {
        return (
          <div className="w-[130px] text-sm text-muted-foreground text-center">
            {user.type || '-'}
          </div>
        )
      }

      if (isCurrentUser) {
        return <div className="text-sm px-2 ">{user.type || '-'}</div>
      }

      return (
        <Select
          defaultValue={user.type}
          onValueChange={(value) => onUserUpdate(value, user, 'type')}
          disabled={isCurrentUser}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            {types.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'verified',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Verified"
        className="text-sm text-center w-full"
      />
    ),
    cell: ({ row }) => (
      <div
        className={cn(
          'w-[100px] text-sm text-center font-semibold',
          row.getValue('verified')
            ? 'text-highlight-green'
            : 'text-highlight-red'
        )}
      >
        {row.getValue('verified') ? 'Yes' : 'No'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'last_logged_in_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Last Login"
        className="text-sm"
      />
    ),
    cell: ({ row }) => {
      const date = row.getValue('last_logged_in_at')
      if (!date) return <div className="text-sm text-center">—</div>

      return (
        <div className="flex flex-col text-xs">
          <span className="truncate font-medium text-muted-foreground">
            {moment(date).format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {moment(date).format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Created At"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col text-xs">
        <span className="truncate font-medium text-muted-foreground">
          {moment(row.getValue('created_at')).format('DD-MM-YYYY')}
        </span>
        <span className="truncate text-sm text-muted-foreground">
          {moment(row.getValue('created_at')).format('h:mm A')}
        </span>
      </div>
    ),
    enableSorting: true,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-sm text-center w-full"
      />
    ),
    cell: ({ row }) => {
      const user = row.original
      const isCurrentUser = user.account_id === dashboardAccountId
      const isLoading = isLoadingUserIDs.includes(user.account_id)

      return (
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onUserLogout(user.account_id)
            }}
            disabled={isCurrentUser || isLoading}
            variant={isCurrentUser ? 'ghost' : 'default'}
            size="sm"
          >
            Logout
          </Button>

          {isDashboardAdminUser && (
            <Button
              onClick={(e) => {
                e.stopPropagation()
                onUserDelete(user.account_id)
              }}
              disabled={isCurrentUser || isLoading}
              variant={isCurrentUser ? 'ghost' : 'destructive'}
              size="sm"
            >
              Delete
            </Button>
          )}
        </div>
      )
    },
    enableSorting: false,
  },
]

export const columnsForDashboardEvents = (
  ActionButton: (props: { row: DashboardUserEvent }) => ReactNode
): ColumnDef<DashboardUserEvent>[] => [
  {
    id: 'serialNumber',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Sr No."
        className="text-sm "
      />
    ),
    cell: ({ row }) => (
      <div className="text-xs text-center">{row.index + 1}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Time" className="text-sm" />
    ),
    cell: ({ row }) => {
      const createdAt = moment(row.getValue('created_at'))
      return (
        <div className="w-[120px] flex flex-col text-xs">
          <span className="truncate font-bold text-muted-foreground">
            {createdAt.format('DD-MM-YYYY')}
          </span>
          <span className="truncate text-sm text-muted-foreground">
            {createdAt.format('h:mm A')}
          </span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ip_address',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="IP Address"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="">
        <CopyableCell value={row.getValue('ip_address')} />
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" className="text-sm" />
    ),
    cell: ({ row }) => (
      <div className="w-[150px]">
        {`${row.original.first_name || '-'} ${row.original.last_name || '-'}`}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[150px] text-xs font-semibold text-highlight-yellow">
        {row.getValue('action')}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'device_info',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Device Info"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <div>{`${row.original.device_info.os?.name || '-'} ${
          row.original.device_info.os?.version || '-'
        }`}</div>
        <div className="text-xs text-muted-foreground">
          {`${row.original.device_info.device?.vendor || '-'} ${
            row.original.device_info.device?.model || '-'
          }`}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'browser',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Browser"
        className="text-sm"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[120px]">
        <div>{row.original.device_info.browser?.name || '-'}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.device_info.browser?.major &&
          row.original.device_info.browser?.version
            ? `v${row.original.device_info.browser.major} (${row.original.device_info.browser.version})`
            : '-'}
        </div>
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'action',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Actions"
        className="text-sm"
      />
    ),
    cell: ({ row }) => <ActionButton row={row.original} />,
    enableSorting: false,
  },
]
