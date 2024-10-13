import { AccountResponse } from '@/lib/types/types'
import moment from 'moment'
import { unquotedKeysString } from '@/utils/utils'

export const accountsToTableRowsCSV = (accounts: AccountResponse[]) => {
  return accounts.map((account) => ({
    'Account ID': account.gui_account_id,
    'Name': `${account.first_name} ${account.last_name}`, 
    'Email': account.email,
    'Balance': account.wallet_balance,
    'Withdraw': account.withdraw_balance,
    'Tracker': account.onboarding_tracker,
    'Status': account.status,
    'Created At': moment(account.created_at).format('DD-MM-YYYY'),
    'Mobile': account.mobile,
    'Registration Type': account?.nominator?.id
      ? 'Nominator'
      : account?.referral?.id
      ? 'Referral'
      : 'Access Code',
    'Nominator Name': account?.nominator?.name || '-',
    'Nominator Code': account?.nominator?.code || '-',
    'Referral Name': account?.referral?.referred_by || '-',
    'Referral Code': account?.referral?.code || '-',
    'Private Equity Holding': account?.pe_holdings?.length
      ? unquotedKeysString(account?.pe_holdings)
      : '',
    'Private Credit Holding': account?.pc_holdings?.length
      ? unquotedKeysString(account?.pc_holdings)
      : '',
    'Total Private Equity Holdings Value': account?.total_pe_holdings_value || '0',
    'Total Private Credit Holdings Value': account?.total_pc_holdings_value || '0',
  }))
}

export const getHeadersForCSV = () => [
  'Account ID',
  'Name',
  'Mobile',
  'Email',
  'Registration Type',
  'Nominator Name',
  'Nominator Code',
  'Referral Name',
  'Referral Code',
  'Balance',
  'Withdraw',
  'Tracker',
  'Status',
  'Private Equity Holding',
  'Private Credit Holding',
  'Total Private Equity Holdings Value',
  'Total Private Credit Holdings Value',
  'Created At',
]
