'use client'
import React, { useState } from 'react'
import { OrdersParams, WaitlistResponse } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import { DataTable } from './components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import FilterDateSelect from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'

import { Loader2 } from 'lucide-react'
import { getAquisitionAnalyticsData } from '@/lib/api/acquisitionApi'
import { columnsForWaitlist } from './components/table/columns'
import { useToast } from '@/hooks/use-toast'
import { sendEmail } from '@/lib/api/mediaHandlerApi'

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
const DashboardStatCard = ({ title, value, onClick, isLoading }) => {
  return (
    <Card
      className="h-32 w-[300px] cursor-pointer hover:shadow-md transition-shadow duration-300"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </CardHeader>
      <CardContent className="pt-0 flex justify-between items-center">
        {isLoading ? (
          <Loader2 className="h-6 w-6 animate-spin" />
        ) : (
          <span className="text-3xl font-bold">{value}</span>
        )}
        <ChevronRight className="h-6 w-6 text-muted-foreground" />
      </CardContent>
    </Card>
  )
}
const Acquisition = () => {
  const router = useRouter()
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [openDrawer, setOpenDrawer] = useState(false)
  const [dateFilter, setDateFilter] = useState<{
    startDate: Moment | null
    endDate: Moment | null
  }>({
    startDate: null,
    endDate: null,
  })

  const getFilteredData = () => {
    return acquisitions?.recentWaitlists?.waitlists || []
  }

  const getColumns = () => {
    return columnsForWaitlist(ActionButton)
  }
  const fetchOrder = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    const data = await getAquisitionAnalyticsData(params)
    return data
  }

  const { data: acquisitions, isLoading } = useQuery({
    queryKey: ['acquisition-analytics', dateFilter],
    queryFn: () => fetchOrder(),
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
        Acquisition
      </h1>
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Waitlist"
          value={acquisitions?.totalWaitlistUsersCount || 0}
          onClick={() => router.push(`/acquisition/ALL`)}
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Pending Waitlist"
          value={acquisitions?.pendingWaitlistUsersCount || 0}
          onClick={() => router.push(`/acquisition/PENDING`)}
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4  " />
      <div className="w-full flex flex-wrap gap-4 mt-4 px-4">
        <DashboardStatCard
          title="Sent Access code"
          value={acquisitions?.sentAccessCodeCount || 0}
          onClick={() => router.push(`/acquisition/SENT_CODE`)}
          isLoading={isLoading}
        />
        <DashboardStatCard
          title="Did not send access code"
          value={acquisitions?.didNotSendAccessCodeCount || 0}
          onClick={() => router.push(`/acquisition/DID_NOT_SEND_CODE`)}
          isLoading={isLoading}
        />
      </div>
      <Separator className="my-4 mx-4 " />
      <div className="w-full px-4 mt-4">
        <h2 className="text-2xl font-semibold mb-4">Recent orders</h2>
        <DataTable
          columns={getColumns() as ColumnDef<WaitlistResponse>[]}
          data={getFilteredData()}
          enableSearch={false}
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
          filter={''}
          onChangeFilter={() => {}}
          total={acquisitions?.recentWaitlists?.waitlists.total}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default Acquisition
