'use client'
import React, { useState } from 'react'
import { OrdersParams, WaitlistResponse } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

import { DataTable } from '../components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from '../components/filterDrawer'
import moment, { Moment } from 'moment'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'
import { getAquisitionAnalyticsDataByStatus } from '@/lib/api/acquisitionApi'
import { columnsForWaitlist } from '../components/table/columns'
import { useToast } from '@/hooks/use-toast'
import { sendEmail } from '@/lib/api/mediaHandlerApi'
import { CSVLink } from 'react-csv'
import { acquisitionHeaders } from '@/constants/headers'

const ActionButton = ({ row }: { row: WaitlistResponse }) => {
  const { toast } = useToast()
  const [sendingEmailId, setSendingEmailId] = useState<boolean>(false)
  const onClickAction = async (row: WaitlistResponse) => {
    setSendingEmailId(true)
    try {
      const response = await sendEmail(row.id)
      if (response.data) {
        toast({
          title: 'Email sent',
          description: 'Email sent to the waitlist user',
          variant: 'success',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send email',
        variant: 'destructive',
      })
    } finally {
      setSendingEmailId(false)
    }
  }
  return (
    <Button
      onClick={() => onClickAction(row)}
      disabled={sendingEmailId}
      className="w-32 flex items-center justify-center"
    >
      {sendingEmailId ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Sending...</span>
        </>
      ) : (
        <span>Send Email</span>
      )}
    </Button>
  )
}
const Acquisition = () => {
  const params = useParams()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })

  const getFilteredData = () => {
    return acquisitions?.PE || []
  }

  const getColumns = () => {
    return columnsForWaitlist(ActionButton)
  }
  const fetchOrder = async (slug: string) => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (search !== '') {
      params.search = search
    }
    const data = await getAquisitionAnalyticsDataByStatus(slug, params)
    return data
  }

  const { data: acquisitions, isLoading } = useQuery({
    queryKey: [
      `acquisition-analytics-${params.slug}`,
      dateFilter,
      search,
      pagination,
    ],
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
          data={acquisitions?.PE || []}
          filename={`AcquisitionData_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={acquisitionHeaders}
        >
          <Button type="button" disabled={!acquisitions}>
            Export
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
        {params.slug === 'ALL'
          ? 'All Waitlist'
          : params.slug === 'PENDING'
          ? 'Pending Waitlist'
          : params.slug === 'SENT_CODE'
          ? 'Sent Access Code'
          : params.slug === 'DID_NOT_SEND_CODE'
          ? 'Did not send access code'
          : ''}
      </h1>

      <div className="w-full px-4 mt-4">
        <DataTable
          columns={getColumns() as ColumnDef<WaitlistResponse>[]}
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
          total={acquisitions?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default Acquisition
