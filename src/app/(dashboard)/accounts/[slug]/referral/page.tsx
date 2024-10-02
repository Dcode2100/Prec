'use client'
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { AccountTable } from '@/components/accountTable/AccountTable'
import { getAccountReferral } from '@/lib/api/accountApi'
import { AccountResponse } from '@/lib/types/types'
import { capitalize } from '@/utils/utils'
import { format } from 'date-fns'
import { useParams, useRouter } from 'next/navigation'

interface ReferralTableProps {
  accountId: string
  type: string
  setSelectedTab: (tab: number) => void
}

const ReferralTable = ({}: ReferralTableProps): React.ReactElement => {
  const router = useRouter()
  const { slug } = useParams()
  const slugString = Array.isArray(slug) ? slug[0] : slug
  const parts = slugString.split('-')
  const accountType = parts[0]
  const accountId = parts.slice(1).join('-')

  const { data: accountReferralData, isLoading } = useQuery({
    queryKey: ['referral', accountId, accountType],
    queryFn: async () => {
      try {
        return await getAccountReferral(accountId, accountType)
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          return { PE: [], total: 0 }
        }
        throw error
      }
    },
  })

  const columns = useMemo(
    () => [
      { header: 'Account ID', accessorKey: 'gui_account_id', sortable: true },
      { header: 'Name', accessorKey: 'name', sortable: true },
      { header: 'Mobile', accessorKey: 'mobile', sortable: true },
      { header: 'Email', accessorKey: 'email', sortable: true },
      { header: 'Tracker', accessorKey: 'onboarding_tracker', sortable: true },
      { header: 'Status', accessorKey: 'status', sortable: true },
      { header: 'Created At', accessorKey: 'created_at', sortable: true },
    ],
    []
  )

  const tableData = useMemo(() => {
    return (accountReferralData?.PE || []).map((acnt: AccountResponse) => ({
      ...acnt,
      name: `${acnt.first_name} ${acnt.last_name}`,
      status: capitalize(acnt.status.split('_').join(' ')),
      created_at: format(new Date(acnt.created_at), 'dd-MM-yyyy HH:mm:ss'),
    }))
  }, [accountReferralData])

  const handleRowClick = (row: any) => {
    router.push(`/accounts/PE/${row.account_id}`)
  }

  return (
    <AccountTable
      columns={columns}
      data={tableData}
      totalItems={accountReferralData?.total || 0}
      itemsPerPage={10}
      currentPage={1}
      onPageChange={(page, pageSize) => {
        // Implement pagination logic here
        console.log('Page changed:', page, 'Page size:', pageSize)
      }}
      isLoading={isLoading}
      onRowClick={handleRowClick}
      isSearchable={false}
    />
  )
}

export default ReferralTable
