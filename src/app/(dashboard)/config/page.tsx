'use client'
import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from '@/components/CustomTable/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { RotateCcw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import CreateAndUpdateConfig from './components/CreateAndUpdateConfig'

import { columnsForConfig } from './components/columns'
import { getAllConfig } from '@/lib/api/configApi'
import { ConfigData, ConfigParams } from '@/lib/types/configTypes'
import { DataTableColumnHeader } from '@/components/CustomTable/data-table-column-header'

const ConfigPage = () => {
  const [search, setSearch] = useState('')
  const [pagination, setPagination] = useState({
    common: { limit: 20, page: 1 },
  })
  const [filters, setFilters] = useState<{
    key: string
    value: string
  }>({
    key: '',
    value: '',
  })
  const getColumns = () => {
    return [
      ...columnsForConfig(),
      {
        id: 'actions',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Actions" className="text-sm" />
        ),
        cell: ({ row }) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEditConfig(row.original)}
          >
            Edit Config
          </Button>
        ),
        enableSorting: false,
      },
    ]
  }

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedConfig, setSelectedConfig] = useState<ConfigData | null>(null)

  const handleEditConfig = (config: ConfigData) => {
    setSelectedConfig(config)
    setIsCreateModalOpen(true)
  }

  const fetchConfig = async () => {
    const params: ConfigParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
    }
    if (search !== '') {
      params.search = search
    }
    return await getAllConfig(params)
  }

  const { data: configData, isLoading, refetch } = useQuery({
    queryKey: ['config', pagination, search, filters],
    queryFn: fetchConfig,
  })

  const resetFilters = () => {
    setSearch('')
    setFilters({ key: '', value: '' })
    setPagination({ common: { limit: 20, page: 1 } })
  }

  const isFiltered =
    search !== '' ||
    pagination.common.limit !== 20 ||
    pagination.common.page !== 1

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-start justify-start p-2">
      <h1 className="text-3xl font-semibold">Config</h1>
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-3">
        <div className="flex items-center gap-4 w-full justify-between">
          <div className="w-64">
            <Input
              placeholder="Search config..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8"
            />
          </div>
          <Button
            size="sm"
            onClick={() => {
              setIsCreateModalOpen(true)
            }}
            className="h-8 flex items-center gap-2"
          >
            Create Config
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
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
        </div>
      </div>
      <div className="w-full">
        <DataTable
          columns={getColumns() as ColumnDef<ConfigData>[]}
          data={configData?.configs || []}
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
          total={configData?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
          onRowClick={() => {}}
        />
      </div>
      <CreateAndUpdateConfig
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false)
          setSelectedConfig(null)
        }}
        onOpen={() => setIsCreateModalOpen(true)}
        refetchConfig={() => refetch()}
        configData={selectedConfig as ConfigData}
      />
    </div>
  )
}

export default ConfigPage
