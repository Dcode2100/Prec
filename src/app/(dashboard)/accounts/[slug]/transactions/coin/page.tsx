'use client'

import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import AccountTable from '@/components/accountTable/AccountTable'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import { getAllCoinTransactions } from '@/lib/api/transactionsApi'
import {
  CoinTransactionResponse,
  TransactionsParams, WalletTransactionDirection
} from '@/lib/types/types'
import { capitalize } from '@/utils/utils'
import { getGlobalItem } from '@/utils/utils'
import { Pe } from '@/lib/types/walletType'
import { ColumnTable } from '@/lib/types'

// Define a type that represents the intersection of Pe and CoinTransactionResponse
type PeWithCoinTransactionFields = Pe & Partial<CoinTransactionResponse>;

function mapPeToCoinTransactionResponse(pe: PeWithCoinTransactionFields): CoinTransactionResponse {
  return {
    transaction_id: pe.gui_account_id || '',
    gui_transaction_id: pe.gui_transaction_id || '',
    gui_account_id: pe.gui_account_id || '',
    referee_account_id: pe.referee_account_id || '',
    direction: pe.direction || 'CREDIT',
    coins: pe.coins || 0,
    reward_type: pe.reward_type || '',
    status: pe.status || 'PENDING',
    description: pe.description || '',
    created_at: pe.created_at || '',
    updated_at: pe.updated_at || '',
    mobile: pe.mobile || '',
    first_name: pe.first_name || '',
    last_name: pe.last_name || '',
    email: pe.email || '',
    account_id: pe.account_id || '',
    referrer_account_id: pe.referrer_account_id || '',
    referee_order_id: pe.referee_order_id || '',
    order_id: pe.order_id || '',
    note: pe.note || '',
  };
}


interface TransactionsProps {
  accountId?: string
  type?: string
}

const CoinTransactionTable = ({
  accountId,
}: TransactionsProps): React.ReactElement => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [search, setSearch] = useState('')
  
  const queryKey = [
    'coinTransactions',
    accountId,
    page,
    limit,
    selectedTab,
    search,
  ]

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const params: TransactionsParams = {
        page,
        limit,
        direction:
          selectedTab !== 'all'
            ? (selectedTab.toUpperCase() as WalletTransactionDirection)
            : undefined,
        search: search || undefined,
      }
      return getAllCoinTransactions(params)
    },
  })

  const transactions: CoinTransactionResponse[] = (data?.PE || []).map(mapPeToCoinTransactionResponse)
  const totalItems = data?.total || 0

  const columns: ColumnTable<CoinTransactionResponse>[] = [
    { header: 'Transaction ID', accessorKey: 'gui_transaction_id' },
    { header: 'Account ID', accessorKey: 'gui_account_id' },
    { header: 'Direction', accessorKey: 'direction' },
    { header: 'Coins', accessorKey: 'coins' },
    {
      header: 'Reward Type',
      accessorKey: 'reward_type',
      cell: (value) => {
        switch (value) {
          case 'REDEMPTION_ORDER':
            return 'Redemption Order'
          case 'REFEREE_ORDER':
            return 'Referee Order'
          case 'SELF_SIGNUP':
            return 'Self SignUp'
          default:
            return value as string
        }
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: (value) =>
        capitalize((value as string)?.split('_').join(' ') || ''),
    },
    { header: 'Description', accessorKey: 'description' },
    {
      header: 'Created At',
      accessorKey: 'created_at',
      cell: (value) => moment(value as string).format('YYYY-MM-DD HH:mm:ss'),
    },
  ]

  const handleTabChange = (value: string) => {
    setSelectedTab(value)
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  const handlePageChange = (newPage: number, newLimit?: number) => {
    setPage(newPage)
    if (newLimit) setLimit(newLimit)
  }

  return (
    <div className="space-y-4">
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="credit">Credit</TabsTrigger>
            <TabsTrigger value="debit">Debit</TabsTrigger>
          </TabsList>
          <Button asChild>
            <CSVLink
              data={transactions}
              filename={`CoinsTransactionData_${moment().format(
                'YYYY-MM-DD_HH-mm-ss'
              )}.csv`}
            >
              Export
            </CSVLink>
          </Button>
        </div>
        <TabsContent value="all">
          <AccountTable
            columns={columns }
            data={transactions}
            totalItems={totalItems}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={handlePageChange}
            isSearchable={true}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="credit">
          <AccountTable
            columns={columns}
            data={transactions}
            totalItems={totalItems}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={handlePageChange}
            isSearchable={true}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="debit">
          <AccountTable
            columns={columns}
            data={transactions}
            totalItems={totalItems}
            itemsPerPage={limit}
            currentPage={page}
            onPageChange={handlePageChange}
            isSearchable={true}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CoinTransactionTable
