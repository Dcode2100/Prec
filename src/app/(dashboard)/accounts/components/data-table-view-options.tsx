import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { MixerHorizontalIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { CSVLink } from 'react-csv'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { csvAccountHeaders } from '../data/data'
import moment from 'moment'
import { useEffect } from 'react'
import { capitalize, isArray } from 'lodash'
import { AccountResponse, NominatorAccountResponse } from '@/lib/types/types'
import { getGlobalItem } from '@/utils/utils'
import { DateRange } from "react-day-picker"
import { DateRangePicker } from "@/components/DateRangePicker"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
  fetchedData: TData[]
  onDateRangeChange: (range: DateRange | undefined) => void
  dateRange: DateRange | undefined
}

export const accountsToTableRowsCSV = (
  accounts: AccountResponse[] | NominatorAccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  const isAffiliate = getGlobalItem('isAffiliate')
  if (!accounts) return []
  return (accounts || []).map((account) => [
    account.gui_account_id || '',
    account?.first_name + ' ' + account?.last_name,
    account.mobile || '',
    account.email || '',
    account?.nominator?.id
      ? 'Nominator'
      : account?.referral?.id
      ? 'Referral'
      : 'Access Code',
    account?.nominator?.name || '-',
    account?.nominator?.code || '-',
    account?.referral?.referred_by || '-',
    account?.referral?.code || '-',
    account?.wallet_balance || '0',
    account?.withdraw_balance || '0',
    account.onboarding_tracker || '0',
    capitalize(account.status?.split('_').join(' ')),
    account?.pe_holdings?.length
      ? unquotedKeysString(account?.pe_holdings)
      : '',
    account?.pc_holdings?.length
      ? unquotedKeysString(account?.pc_holdings)
      : '',
    account?.total_pe_holdings_value || '0',
    account?.total_pc_holdings_value || '0',
    new Date(account.created_at).toLocaleDateString(),
  ])
}

// Add this function to handle the unquotedKeysString
function unquotedKeysString(holdings: any[]): string {
  if (!isArray(holdings)) return ''
  return holdings
    .map((holding) => {
      const entries = Object.entries(holding)
      return entries.map(([key, value]) => `${key}:${value}`).join(', ')
    })
    .join('; ')
}

export function DataTableViewOptions<TData>({
  table,
  fetchedData,
  onDateRangeChange,
  dateRange,
}: DataTableViewOptionsProps<TData>) {
  return (
    <div className="flex items-center">
      <CSVLink
        data={accountsToTableRowsCSV(
          fetchedData as (AccountResponse | NominatorAccountResponse)[]
        )}
        headers={csvAccountHeaders}
        filename={`AccountsData_${moment(new Date()).format(
          'MMMM Do YYYY, h:mm:ss a'
        )}.csv`}
        className="mr-2"
      >
        <Button variant="outline" size="sm" className="h-8">
          Export CSV
        </Button>
      </CSVLink>
      <DateRangePicker
        date={dateRange}
        onDateChange={onDateRangeChange}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="h-8">
            <MixerHorizontalIcon className="mr-2 h-4 w-4" />
            View
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[150px]">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter(
              (column) =>
                typeof column.accessorFn !== 'undefined' && column.getCanHide()
            )
            .map((column) => {
              return (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              )
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
