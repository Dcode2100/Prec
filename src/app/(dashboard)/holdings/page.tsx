'use client'
import React, { useState } from 'react'
import { AccountWiseHoldingData, OrdersParams } from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from './components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { getAllHoldings, getAllPcHoldings } from '@/lib/api/holdingApi'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PcHolding } from '@/lib/types/getAllPCHoldingsType'
import {
  accountWiseHoldingColumns,
  pcHoldingColumns,
} from './components/table/columns'
import { CSVLink } from 'react-csv'
import { Button } from '@/components/ui/button'
import { pcHoldingHeaders, peHoldingHeaders } from '@/constants/headers'
import FilterDrawer from './components/filterDrawer'

const HoldingsPage = () => {
  const [drawer, setDrawer] = useState(false)
  const [selectedToken, setSelectedToken] = useState<string | null>(null)
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    common: { limit: 10, page: 1 },
  })
  const [search, setSearch] = useState('')

  const handleTabChange = (value: string) => {
    if (value === 'pe') {
      setSelectedAsset(null)
    } else if (value === 'pc') {
      setSelectedToken(null)
    }
  }

  const fetchPEHoldings = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }
    if (selectedToken) {
      params.token = selectedToken
    }
    const data = await getAllHoldings(params)
    return data
  }

  const {
    data: allPEholdings,
    isLoading: isPELoading,
    refetch,
  } = useQuery({
    queryKey: ['all-pe-holdings', pagination, search, selectedToken],
    queryFn: () => fetchPEHoldings(),
  })

  const fetchPCHoldings = async () => {
    const params: OrdersParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }
    if (selectedAsset) {
      params.asset_id = selectedAsset
    }
    const data = await getAllPcHoldings(params)
    return data
  }

  const { data: allPCholdings, isLoading: isPCLoading } = useQuery({
    queryKey: ['all-pc-holdings', pagination, search, selectedAsset],
    queryFn: () => fetchPCHoldings(),
  })

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <h1 className="w-full px-5 text-left text-2xl text-muted-foreground"></h1>
      <Tabs
        defaultValue="pe"
        className="w-full 100 px-4 mt-4"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid w-[200px] grid-cols-2">
          <TabsTrigger value="pe">PE Holding</TabsTrigger>
          <TabsTrigger value="pc">PC Holding</TabsTrigger>
        </TabsList>

        <TabsContent value="pe">
          <FilterDrawer
            tab={'PE'}
            open={drawer}
            onOpenChange={setDrawer}
            header="Filter"
            onTokenSelect={setSelectedToken}
          />
          <div className="flex gap-2 justify-end">
            <CSVLink
              headers={peHoldingHeaders}
              data={allPEholdings?.PE || []}
              filename={'pe-holdings.csv'}
            >
              <Button className="h-8" disabled={isPELoading}>
                {isPELoading ? 'Loading...' : 'Export'}
              </Button>
            </CSVLink>
            <Button
              variant="outline"
              className="h-8"
              onClick={() => setDrawer(true)}
            >
              Filter
            </Button>
          </div>
          <DataTable
            columns={
              accountWiseHoldingColumns as ColumnDef<AccountWiseHoldingData>[]
            }
            data={allPEholdings?.PE || []}
            enableSearch={false}
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
            filter={''}
            onChangeFilter={() => {}}
            total={allPEholdings?.total || 0}
            isLoading={isPELoading}
            refetch={refetch}
          />
        </TabsContent>
        <TabsContent value="pc">
          <FilterDrawer
            tab={'PC'}
            open={drawer}
            onOpenChange={setDrawer}
            header="Filter"
            onTokenSelect={setSelectedAsset}
          />
          <div className="flex gap-2 justify-end">
            <CSVLink
              headers={pcHoldingHeaders}
              data={allPCholdings?.holdings || []}
              filename={'pc-holdings.csv'}
            >
              <Button className="h-8" disabled={isPCLoading}>
                {isPCLoading ? 'Loading...' : 'Export'}
              </Button>
            </CSVLink>
            <Button
              variant="outline"
              className="h-8"
              onClick={() => setDrawer(true)}
            >
              Filter
            </Button>
          </div>
          <DataTable
            columns={pcHoldingColumns as ColumnDef<PcHolding>[]}
            data={allPCholdings?.holdings || []}
            enableSearch={false}
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
            filter={''}
            onChangeFilter={() => {}}
            total={allPEholdings?.total || 0}
            isLoading={isPCLoading}
            refetch={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default HoldingsPage
