'use client'
import React,{ useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { getAccountHoldings } from '@/lib/api/accountApi'
import { getNumberInRupee } from '@/lib/globals/utils'
import { AccountWiseHoldingData } from '@/lib/types/types'
import { useParams } from 'next/navigation'
import ConfirmationModal from '@/components/modals/ConfirmationModal'
import ApplyRightsIssueModal from '@/components/modals/ApplyRightsIssueModal'
import TransferHoldingModal from '@/components/modals/TransferHoldingModal'
import { Button } from '@/components/ui/button'
import { useSelector } from 'react-redux'
import { SortingState } from '@tanstack/react-table'
import { CSVLink } from 'react-csv'
import moment from 'moment'

const HoldingsPage = () => {
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [selectedHoldingId, setSelectedHoldingId] = useState<string>('')

  const userType = useSelector((state: any) => state.user.userType)
  const [SelectedHoldingsData, setSelectedHoldingsData] = useState<
    AccountWiseHoldingData[]
  >([])
  const { data, isLoading } = useQuery({
    queryKey: ['holdings', accountId, accountType],
    queryFn: async () => {
      try {
        const holdings = await getAccountHoldings(accountId, accountType)
        setSelectedHoldingsData(holdings)
        return holdings
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return []
        }
        throw error
      }
    },
  })

  const columns = useMemo(
    () => [
      { header: 'Token', accessorKey: 'token', sortable: true },
      {
        header: 'Symbol',
        accessorKey: 'symbol',
        cell: (value: string) => value.split('-')[0],
        sortable: true,
      },
      { header: 'Quantity', accessorKey: 'quantity', sortable: true },
      {
        header: 'Price',
        accessorKey: 'price',
        cell: (value: number) => getNumberInRupee(value, true),
        sortable: true,
      },
      {
        header: 'Investment',
        accessorKey: 'investment',
        cell: (value: number, row: any) =>
          getNumberInRupee(row.price * row.quantity),
      },
      { header: 'LTP', accessorKey: 'curr_price' },
      {
        header: 'PNL',
        accessorKey: 'pnl',
        cell: (value: number) => getNumberInRupee(value),
      },
      {
        header: 'Percentage PNL',
        accessorKey: 'pnl_percentage',
        cell: (value: number) => `${value}%`,
      },
      {
        header: 'Transfer Holding',
        accessorKey: 'transfer',
        cell: (row: any) => (
          <Button
            disabled={row?.sold}
            variant="outline"
            size="sm"
            onClick={() => openTransferHoldingModal(data?.id)}
          >
            Transfer
          </Button>
        ),
      },
      {
        header: 'Update Holding',
        accessorKey: 'update',
        cell: (row: any) =>
          row?.sold ? (
            <p className="text-red-500">Sold</p>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => openConfirmationModal(row?.id)}
            >
              Update
            </Button>
          ),
      },
      {
        header: 'Apply Rights Issue',
        accessorKey: 'apply',
        cell: (row: any) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openApplyRightsIssueModal(row?.id)}
          >
            Apply
          </Button>
        ),
      },
    ],
    [userType]
  )

  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false)
  const [isApplyRightsIssueModalOpen, setIsApplyRightsIssueModalOpen] =
    useState(false)
  const [isTransferHoldingModalOpen, setIsTransferHoldingModalOpen] =
    useState(false)

  const openConfirmationModal = (holdingId: string) => {
    setSelectedHoldingId(holdingId)
    setIsConfirmationModalOpen(true)
  }

  const closeConfirmationModal = () => setIsConfirmationModalOpen(false)

  const openApplyRightsIssueModal = (holdingId: string) => {
    setSelectedHoldingId(holdingId)
    setIsApplyRightsIssueModalOpen(true)
  }

  const closeApplyRightsIssueModal = () => setIsApplyRightsIssueModalOpen(false)

  const openTransferHoldingModal = (holdingId: string) => {
    setSelectedHoldingId(holdingId)
    setIsTransferHoldingModalOpen(true)
  }

  const closeTransferHoldingModal = () => setIsTransferHoldingModalOpen(false)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const ExportExcelAccountHeaders = [
    { label: 'Token', key: 'token' },
    { label: 'Symbol', key: 'symbol' },
    { label: 'Net Quantity', key: 'quantity' },
    { label: 'Net Average Price', key: 'price' },
    { label: 'Net Amount', key: 'amount' },
    { label: 'Buy Quantity', key: 'buy_quantity' },
    { label: 'Buy Amount', key: 'buy_amount' },
    { label: 'Sell Quantity', key: 'sell_quantity' },
    { label: 'Sell Price', key: 'sell_price' },
    { label: 'Sell Amount', key: 'sell_amount' },
    { label: 'Sold', key: 'sold' },
    { label: 'Current Price', key: 'curr_price' },
    { label: 'Current Value', key: 'curr_value' },
    { label: 'PnL', key: 'pnl' },
    { label: 'PnL Percentage', key: 'pnl_percentage' },
    { label: 'Buy Transaction Fees', key: 'buy_transaction_fees' },
    { label: 'Sell Transaction Fees', key: 'sell_transaction_fees' },
  ]

  return (
    <>
      <div className="items-center flex justify-between px-2">
        <h2 className="text-lg tracking-tight ">PE Holdings</h2>
        <CSVLink
          data={SelectedHoldingsData}
          filename={`AccountsData_${moment(new Date()).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}.csv`}
          headers={ExportExcelAccountHeaders}
        >
          <Button className="mr-200" disabled={!SelectedHoldingsData.length}>
            Export CSV
          </Button>
        </CSVLink>
      </div>

      <AccountTable
        isSearchable={false}
        columns={columns}
        data={data || []}
        totalItems={data?.length || 0}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />

      <ConfirmationModal
        openConfirmationModal={isConfirmationModalOpen}
        setOpenConfirmationModal={setIsConfirmationModalOpen}
        holding_id={selectedHoldingId}
        sold={true}
      />

      <ApplyRightsIssueModal
        openApplyRightsIssueModal={isApplyRightsIssueModalOpen}
        setOpenApplyRightsIssueModal={setIsApplyRightsIssueModalOpen}
        holding_id={selectedHoldingId}
        accountId={accountId}
      />
      <TransferHoldingModal
        isOpen={isTransferHoldingModalOpen}
        onClose={closeTransferHoldingModal}
        holdingId={selectedHoldingId}
        sendersAccountId={accountId}
        onTransferSuccess={() => {}}
      />
    </>
  )
}

export default HoldingsPage
