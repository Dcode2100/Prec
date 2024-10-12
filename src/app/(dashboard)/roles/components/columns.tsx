'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'

import { DashboardUser } from '@/lib/types/dashboardUserType'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import CopyableCell from '@/components/CopyCell'
import { cn } from '@/lib/utils'
interface DashboardUsersColumnsProps {
  isDashboardAdminUser: boolean
  dashboardAccountId: string
  onUserLogout: (accountId: string) => void
  onUserDelete: (accountId: string) => void
  isLoadingUserIDs: string[]
}
export const columnsForRoles = (): ColumnDef<DashboardUser>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Role Name"
        className="text-sm p-2"
      />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] text-sm font-semibold text-highlight-yellow">
        {row.getValue('name') || '-'}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'access',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Access"
        className="text-sm p-2 text-center w-full"
      />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-center text-highlight-gray">
        {row.getValue('access') || 0}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'totalAccess',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Access"
        className="text-sm p-2 text-center w-full"
      />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-center text-highlight-gray">
        {row.getValue('totalAccess') || 0}
      </div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'totalAccounts',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Total Accounts"
        className="text-sm p-2 text-center w-full"
      />
    ),
    cell: ({ row }) => (
      <div className="text-sm font-semibold text-center text-highlight-gray">
        {row.getValue('totalAccounts') || 0}
      </div>
    ),
    enableSorting: false,
  },
]

export const columnsForUser = ({
  isDashboardAdminUser,
  dashboardAccountId,
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
