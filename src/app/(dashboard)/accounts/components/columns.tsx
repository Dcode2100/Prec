'use client'
import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { useRouter } from 'next/navigation'
import { AccountResponse, NominatorAccountResponse } from '@/lib/types/types'

export const columns: ColumnDef<AccountResponse | NominatorAccountResponse>[] = [
  {
    accessorKey: 'gui_account_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account ID" />
    ),
    cell: ({ row }) => {
      const router = useRouter()
      return (
        <div
          className="w-[80px] cursor-pointer text-blue-500"
          onClick={() => router.push(`/accounts/${row.getValue('account_id')}`)}
        >
          {row.getValue('gui_account_id')}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'first_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="First Name" />
    ),
    cell: ({ row }) => {
      return <div>{row.getValue('first_name')}</div>
    },
  },
  {
    accessorKey: 'last_name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Last Name" />
    ),
    cell: ({ row }) => <div>{row.getValue('last_name')}</div>,
  },
  {
    accessorKey: 'mobile',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mobile" />
    ),
    cell: ({ row }) => <div>{row.getValue('mobile')}</div>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'wallet_balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Balance" />
    ),
    cell: ({ row }) => <div>{row.getValue('wallet_balance')}</div>,
  },
  {
    accessorKey: 'withdraw_balance',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Withdraw" />
    ),
    cell: ({ row }) => <div>{row.getValue('withdraw_balance')}</div>,
  },
  {
    accessorKey: 'onboarding_tracker',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tracker" />
    ),
    cell: ({ row }) => <div>{row.getValue('onboarding_tracker')}</div>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created At" />
    ),
    cell: ({ row }) => {
      const dateValue = row.getValue('created_at');
      const getDate = (dateValue: any): Date => {
        if (dateValue instanceof Date) return dateValue;
        if (typeof dateValue === 'string' || typeof dateValue === 'number') return new Date(dateValue);
        if (dateValue && typeof dateValue === 'object' && 'date' in dateValue) return new Date(dateValue.date);
        return new Date(); // fallback to current date
      };

      const date = getDate(dateValue);
      if (isNaN(date.getTime())) return 'Invalid Date';

      const ISTOffset = 330;
      const ISTTime = new Date(date.getTime() + ISTOffset * 60000);
      const dateStr = ISTTime.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      }).replace(/\//g, '-');
      const timeStr = ISTTime.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      return (
        <div>
          <div>{dateStr}</div>
          <div className="text-muted-foreground">{timeStr}</div>
        </div>
      );
    },
  },
  // {
  //   id: 'actions',
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]
