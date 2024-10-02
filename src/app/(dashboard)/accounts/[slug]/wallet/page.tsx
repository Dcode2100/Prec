'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { AccountTable } from '@/components/accountTable/AccountTable'
import {
  createVirtualAccount,
  getWalletByAccountId,
} from '@/lib/api/accountApi'
import { format } from 'date-fns'
import { useParams } from 'next/navigation'

const walletTabsHeader = [
  'Gui Wallet Id',
  'Vendor Wallet Id',
  'Account Number',
  'IFSC Code',
  'Account Balance',
  'Withdraw Balance',
  'Status',
  'Vendor Name',
  'Provider',
  'Created At',
]

const AccountWalletDetailsTable = (): React.ReactElement => {
  const { toast } = useToast()
  const [limit, setLimit] = useState(10)
  const [page, setPage] = useState(1)
  const [isCreateWalletLoading, setIsCreateWalletLoading] = useState(false)
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const {
    data: walletData,
    isLoading: walletLoading,
    refetch: walletRefetch,
    isError,
    error,
  } = useQuery({
    queryKey: ['getWalletByAccountId', accountId, limit, page],
    queryFn: () => getWalletByAccountId(accountId, { page, limit }),
  })

  const handleWalletCreate = async (accountId: string) => {
    setIsCreateWalletLoading(true)
    try {
      const createWalletResponse = await createVirtualAccount(accountId)
      if (createWalletResponse?.statusCode === 201) {
        walletRefetch()
        toast({
          description: createWalletResponse?.message,
        })
      }
    } catch (err) {
      toast({
        variant: 'destructive',
        description: 'Failed to create wallet',
      })
    }
    setIsCreateWalletLoading(false)
  }

  const columns = [
    { header: 'Gui Wallet Id', accessorKey: 'gui_wallet_id' },
    { header: 'Vendor Wallet Id', accessorKey: 'vendor_wallet_id' },
    { header: 'Account Number', accessorKey: 'account_number' },
    { header: 'IFSC Code', accessorKey: 'ifsc_code' },
    {
      header: 'Account Balance',
      accessorKey: 'account_balance',
      cell: (value: number) => Number(value ?? 0).toLocaleString('en-IN'),
    },
    {
      header: 'Withdraw Balance',
      accessorKey: 'withdraw_amount',
      cell: (value: number) => Number(value ?? 0).toLocaleString('en-IN'),
    },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Vendor Name', accessorKey: 'vendor_name' },
    { header: 'Provider', accessorKey: 'provider_name' },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: (value: string) => format(new Date(value), 'dd-MM-yyyy HH:mm:ss'),
    },
  ]

  return (
    <>
      {walletData?.data?.data?.walletDetails[0]?.vendor_status ===
        'EXPIRED' && (
        <div className="flex justify-end">
          <Button
            disabled={walletLoading}
            // isLoading={isCreateWalletLoading}
            onClick={() => handleWalletCreate(accountId)}
          >
            Create Wallet
          </Button>
        </div>
      )}
      <h3 className="ml-1 text-xl">Wallet</h3>
      <AccountTable
        columns={columns}
        data={walletData?.data?.data?.walletDetails || []}
        totalItems={walletData?.data?.data?.total || 0}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={(newPage, newLimit) => {
          setPage(newPage)
          if (newLimit) setLimit(newLimit)
        }}
        isLoading={walletLoading}
      />
    </>
  )
}

export default AccountWalletDetailsTable
