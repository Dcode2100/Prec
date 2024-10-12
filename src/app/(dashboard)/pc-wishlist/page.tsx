'use client'
import React, { useState } from 'react'
import {
  PCWishlistResponse,
  WishlistResponse,
  WishlistsParams,
} from '@/lib/types/types'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from './components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import CombinedFilter from './components/filterDrawer'
import { Moment } from 'moment'
import { Button } from '@/components/ui/button'
import { DownloadIcon, FilterIcon, RefreshCw, UploadIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getPCWishlistData,
  updatePcWishlist,
  UploadPcWishlistData,
} from '@/lib/api/wishlistApi'

import { useToast } from '@/hooks/use-toast'
import { columnsForWishlist } from './components/table/columns'
import { CSVLink } from 'react-csv'
import { pcWishlistHeaders } from '@/constants/headers'

const ActionButton = ({ row }: { row: WishlistResponse }) => {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState<boolean>(false)

  const updateNotifiedStatus = async (value: string) => {
    setIsUpdating(true)
    try {
      const response = await updatePcWishlist(row.wishlist_id, value === 'yes')
      if (response.data) {
        toast({
          title: 'Status updated',
          description: `Notified status set to ${value}`,
          variant: 'success',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status',
        variant: 'destructive',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Select
      onValueChange={updateNotifiedStatus}
      defaultValue={row.notified ? 'yes' : 'no'}
      disabled={isUpdating}
    >
      <SelectTrigger className="w-32">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="yes">Yes</SelectItem>
        <SelectItem value="no">No</SelectItem>
      </SelectContent>
    </Select>
  )
}

const PcWishlist = () => {
  const [search, setSearch] = useState('')
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
  const [selectedToken, setSelectedToken] = useState<string[] | null>(null)
  const [isFileLoading, setIsFileLoading] = useState(false)
  const { toast } = useToast()

  const getFilteredData = () => {
    return wishlists?.wishlists || []
  }

  const getColumns = () => {
    return columnsForWishlist(ActionButton)
  }
  const fetchOrder = async () => {
    const params: WishlistsParams = {
      limit: pagination.common.limit,
      page: pagination.common.page,
      createdAfter: dateFilter.startDate?.toISOString(),
      createdBefore: dateFilter.endDate?.toISOString(),
    }
    if (selectedToken) {
      params.asset_id = selectedToken
    }
    if (search !== '') {
      params.search = search
    }
    const data = await getPCWishlistData(params)
    return data
  }

  const {
    data: wishlists,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['all-pc-wishlists', dateFilter, selectedToken, search],
    queryFn: () => fetchOrder(),
  })

  const handleFilterApply = (
    startDate: Moment | null,
    endDate: Moment | null,
    token: string[] | null
  ) => {
    setDateFilter({ startDate, endDate })
    setSelectedToken(token)
  }

  const handleResetFilters = () => {
    setSearch('')
    setDateFilter({ startDate: null, endDate: null })
    setSelectedToken(null)
  }

  const isFilterApplied =
    dateFilter.startDate || dateFilter.endDate || selectedToken || search !== ''

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0]?.type === 'text/csv') {
        const wishlistFile = e.target.files[0]
        const formData = new FormData()
        formData.append('wishlist', wishlistFile)
        formData.append('notified', 'true')
        setIsFileLoading(true)
        try {
          const upload = await UploadPcWishlistData(formData)
          if (upload.data.status) {
            toast({
              title: 'Upload Successful',
              description: 'Wishlist data has been uploaded successfully.',
              variant: 'success',
            })
          }
          refetch()
        } catch (err) {
          toast({
            title: 'Upload Failed',
            description: 'Failed to upload wishlist data.',
            variant: 'destructive',
          })
        } finally {
          setIsFileLoading(false)
        }
      } else {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
          variant: 'destructive',
        })
      }
    }
    // Reset the file input value after upload attempt
    e.target.value = ''
  }

  return (
    <div className="w-full h-full flex overflow-auto flex-col items-center justify-start">
      <h1 className="w-full px-6 mt-5 text-left font-semibold text-3xl ">
        Pc Wishlist
      </h1>
      <div className="w-full flex justify-end items-center gap-4 px-6 ">
        <div className="flex items-center gap-3">
          <CSVLink
            data={getFilteredData()}
            headers={pcWishlistHeaders}
            filename="pc-wishlist.csv"
          >
            <Button size="sm" className="h-8 flex items-center gap-2">
              <DownloadIcon size={16} />
              Export
            </Button>
          </CSVLink>
          <Button
            size="sm"
            className="h-8 flex items-center gap-2"
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={isFileLoading}
          >
            <UploadIcon size={16} />
            {isFileLoading ? 'Uploading...' : 'Bulk Upload'}
          </Button>
          <input
            id="file-upload"
            title="upload"
            type="file"
            accept=".csv"
            onChange={handleBulkUpload}
            style={{ display: 'none' }}
          />
        </div>
        <div className="flex items-center gap-3">
          {isFilterApplied && (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={handleResetFilters}
            >
              <RefreshCw size={16} className="mr-2" />
              Reset
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-9 flex items-center gap-2"
            onClick={() => setOpenDrawer(true)}
          >
            <FilterIcon size={16} />
            <span>Filter Wishlists</span>
          </Button>
        </div>
      </div>
      <CombinedFilter
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        header="Select Filters"
        onFilterApply={handleFilterApply}
        tab="PC"
      />
      <div className="w-full px-4">
        <DataTable
          columns={getColumns() as ColumnDef<PCWishlistResponse>[]}
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
          total={wishlists?.total || 0}
          isLoading={isLoading}
          refetch={() => {}}
        />
      </div>
    </div>
  )
}

export default PcWishlist
