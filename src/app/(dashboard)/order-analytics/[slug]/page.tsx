'use client'
import React, { useState } from 'react'
import { OrdersParams, PEAccountType, PEOrderType } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'next/navigation'
import { DataTable } from '../components/table/data-table'
import {
  columnsAccounts,
  columnsForOrderByStatus,
} from '../components/table/columns'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from '../components/filterDrawer'
import moment, { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { getOrdersByStatus } from '@/lib/api/ordersApi'
import { capitalize } from '@/utils/utils'
import { CSVLink } from 'react-csv'
import {
  orderAnalyticsAccountsHeaders,
  orderAnalyticsOrdersHeaders,
} from '@/constants/headers'

const OrderAnalyticsByStatus = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>(() => {
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    return {
      startDate: startDate ? moment(startDate) : null,
      endDate: endDate ? moment(endDate) : null,
    }
  })

  const getColumns = () => {
    const accountRelatedSlugs = [
      'ADDED_BANK',
      'DID_NOT_ADD_BANK',
      'LINKED_DEMAT',
      'DID_NOT_LINK_DEMAT',
    ]
    if (accountRelatedSlugs.includes(params.slug as string)) {
      return columnsAccounts
    } else {
      return columnsForOrderByStatus
    }
  }
  const getHeaders = () => {
    const accountRelatedSlugs = [
      'ADDED_BANK',
      'DID_NOT_ADD_BANK',
      'LINKED_DEMAT',
      'DID_NOT_LINK_DEMAT',
    ]
    if (accountRelatedSlugs.includes(params.slug as string)) {
      return orderAnalyticsAccountsHeaders
    }
    return orderAnalyticsOrdersHeaders
  }
  const [filter, setFilter] = useState('recentTransactions')
  const fetchOrder = async (slug: string) => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search) {
      params.search = search
    }
    const data = await getOrdersByStatus(slug as string, params)
    return data
  }

  const {
    data: orderAnalytics,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['order-analytics', dateFilter, pagination, search],
    queryFn: () => fetchOrder(params.slug as string),
  })
  const handleDateSelect = (
    startDate: Moment | null,
    endDate: Moment | null
  ) => {
    setDateFilter({ startDate, endDate })
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <div className="w-full flex justify-end items-center gap-2">
        <CSVLink
          headers={getHeaders()}
          data={orderAnalytics?.PE || []}
          filename={`${params.slug}.csv`}
        >
          <Button size="sm" className="h-8" disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Export'}
          </Button>
        </CSVLink>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={() => setOpenDrawer(true)}
        >
          Select Range
        </Button>
      </div>
      <FilterDateSelect
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Select Date Range"
        onDateSelect={handleDateSelect}
      />
      <h1 className="w-full px-5 text-left text-2xl text-muted-foreground">
        {capitalize(params.slug as string)
          .split('_')
          .join(' ')}
      </h1>
      <div className="w-full px-4 mt-4">
        <DataTable
          columns={getColumns() as ColumnDef<PEOrderType | PEAccountType>[]}
          data={orderAnalytics?.PE || []}
          enableSearch={true}
          search={search}
          onSearchChange={setSearch}
          enableDropdown={false}
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
          filter={filter}
          onChangeFilter={(filter: string) => setFilter(filter)}
          total={orderAnalytics?.total || 0}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  )
}

export default OrderAnalyticsByStatus
