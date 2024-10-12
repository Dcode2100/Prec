'use client'
import React, { useMemo, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { getPCHoldingsByAccId } from '@/lib/api/accountApi'
import AccountTable from '@/components/accountTable/AccountTable'
import { pcHoldingsByIdToTableRows } from '@/utils/utils'
import { PCHoldingById } from '@/lib/types/getPCHoldingByIdType'
import { AccountWisePcHoldingData } from '@/lib/types/types'
import moment from 'moment'
import { CSVLink } from 'react-csv'
import { Button } from '@/components/ui/button'

const PCHoldingsTable = (): React.ReactElement => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  // const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const limit = 20
  const [SelectedPCHoldingsData, setSelectedPCHoldingsData] = useState<
    AccountWisePcHoldingData[]
  >([])
  const accountHoldingsQuery = useQuery({
    queryKey: ['pc_acc_holdings', accountId],
    queryFn: async () => {
      try {
        const holdingPCData = await getPCHoldingsByAccId(accountId)
        setSelectedPCHoldingsData(holdingPCData)
        return holdingPCData
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return
        }
        throw error
      }
    },
  })

  useEffect(() => {
    if (accountHoldingsQuery?.isLoading) {
      setIsLoading(true)
    } else {
      setIsLoading(false)
    }
  }, [accountHoldingsQuery?.isLoading])

  const pcHoldings = useMemo(
    () => accountHoldingsQuery?.data || ([] as PCHoldingById[]),
    [accountHoldingsQuery?.data]
  )

  const AccountPcHeaders = [
    { label: 'GUI ID', key: 'gui_id' },
    { label: 'Symbol', key: 'symbol' },
    { label: 'Status', key: 'status' },
    { label: 'UI Rate of Returns', key: 'ui_rate_of_returns' },
    { label: 'Rate of Returns', key: 'rate_of_returns' },
    { label: 'Tenure', key: 'tenure' },
    { label: 'Tentative Tenure', key: 'tentative_tenure' },
    { label: 'Subscription Amount', key: 'subscription_amount' },
    { label: 'Min Repayment Amount', key: 'min_repayment_amount' },
    { label: 'Start Date', key: 'start_date' },
    { label: 'End Date', key: 'end_date' },
    { label: 'Trade Start Date', key: 'trade_start_date' },
    { label: 'Trade End Date', key: 'trade_end_date' },
    { label: 'Tentative Start Date', key: 'tentative_start_date' },
    { label: 'Tentative End Date', key: 'tentative_end_date' },
    { label: 'Repaid Date', key: 'repaid_date' },
    { label: 'To', key: 'to' },
    { label: 'From', key: 'from' },
    { label: 'Buy Transaction Fees', key: 'buy_transaction_fees' },
    { label: 'Returns', key: 'returns' },
    { label: 'Charges', key: 'charges' },
    { label: 'Created At', key: 'created_at' },
    { label: 'Updated At', key: 'updated_at' },
  ]

  const columns = [
    { header: 'Holding ID', accessorKey: 'gui_id' },
    { header: 'Symbol', accessorKey: 'symbol' },
    { header: 'Returns', accessorKey: 'rate_of_returns' },
    { header: 'Tenure', accessorKey: 'tenure' },
    { header: 'Subscription', accessorKey: 'subscription_amount' },
    { header: 'Min Repayment', accessorKey: 'min_repayment_amount' },
    { header: 'Status', accessorKey: 'status' },
    { header: 'Maturity date', accessorKey: 'tentative_end_date' },
    { header: 'Created At', accessorKey: 'created_at' },
  ]

  const tableData = useMemo(() => {
    if (!accountHoldingsQuery.data) return []
    return pcHoldingsByIdToTableRows(accountHoldingsQuery.data)
  }, [accountHoldingsQuery.data])

  return (
    <>
      <div className="items-center flex justify-between px-2">
        <h2 className="text-lg tracking-tight">PC Holdings</h2>
        <CSVLink
          data={SelectedPCHoldingsData}
          filename={`AccountsData_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={AccountPcHeaders}
        >
          <Button className="mr-200" disabled={!SelectedPCHoldingsData.length}>
            Export CSV
          </Button>
        </CSVLink>
      </div>
      <AccountTable
        isSearchable={false}
        columns={columns}
        data={pcHoldings}
        totalItems={tableData.length}
        itemsPerPage={limit}
        currentPage={page}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </>
  )
}

export default PCHoldingsTable
