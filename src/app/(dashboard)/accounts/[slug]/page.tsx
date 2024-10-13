'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { getAccount } from '@/lib/api/accountApi'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { manualCoinTransfer } from '@/lib/api/coinApi'
import AddFundsModal from '@/components/modals/AddFundsModal'
import { AccountResponseById } from '@/lib/types/accountType'
import CreateAWithdrawTransaction from '@/components/modals/CreateAWithdrawTransaction'
import CreateCoinWithdrawTransaction from '@/components/modals/CreateCoinWithdrawTransaction'
import { CopyButton } from '@/components/CopyButton'

const ContactAccordion = ({
  accountResponse,
}: {
  accountResponse: AccountResponseById
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="contact-details">
      <AccordionTrigger>Contact Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <ContactItem
            label="Full Name"
            value={accountResponse?.contact?.name ?? '-'}
          />
          <ContactItem
            label="Email Address"
            value={accountResponse?.contact?.email ?? '-'}
          />
          <ContactItem
            label="Mobile"
            value={
              accountResponse?.contact?.mobile
                ? accountResponse?.contact?.mobile.toString()
                : '-'
            }
          />
          <ContactItem
            label="Demat Account No"
            value={accountResponse?.identity?.bo_id?.[0] ?? '-'}
          />
          <ContactItem
            label="WhatsApp Notification"
            value={accountResponse?.whatsapp_notification ? 'True' : 'False'}
          />
          <ContactItem
            label="Nominated By"
            value={accountResponse?.nominator?.name ?? '-'}
          />
          <ContactItem
            label="Referred By"
            value={
              accountResponse?.referral?.referred_by
                ? accountResponse?.referral?.referred_by
                : '-'
            }
          />
          <ContactItem
            label="Vendor Wallet ID"
            value={accountResponse?.hypto_vendor_wallet_id ?? '-'}
          />
          <div className="flex justify-between h-[1px] bg-border"></div>

          <ContactItem label="UPI ID" value="-" />
          <ContactItem
            label="Created At"
            value={
              accountResponse?.created_at
                ? new Date(accountResponse?.created_at).toLocaleString()
                : '-'
            }
          />
          <ContactItem
            label="Updated At"
            value={
              accountResponse?.updated_at
                ? new Date(accountResponse?.updated_at).toLocaleString()
                : '-'
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const ContactItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex max-h-min justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">
      <CopyButton className="h-min p-0" value={value}>
        {value}
      </CopyButton>
    </span>
  </div>
)

const IdentityAccordion = ({
  accountResponse,
}: {
  accountResponse: AccountResponseById
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="identity-details">
      <AccordionTrigger>Identity Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <IdentityItem label="PAN" value={accountResponse?.pan ?? '-'} />
          <IdentityItem
            label="PAN Linked"
            value={accountResponse?.portal_linked ? 'TRUE' : 'FALSE'}
          />
          <IdentityItem
            label="PAN Updated At"
            value={accountResponse?.pan_updated_at ?? '-'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const IdentityItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">
      <CopyButton className="h-min p-0" value={value}>
        {value}
      </CopyButton>
    </span>
  </div>
)

const BankDetailsAccordion = ({
  accountResponse,
}: {
  accountResponse: AccountResponseById
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="bank-details">
      <AccordionTrigger>Bank Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <BankItem
            label="Account Number"
            value={accountResponse?.bank_details?.[0]?.account_number ?? '-'}
          />
          <BankItem
            label="Bank Name"
            value={accountResponse?.bank_details?.[0]?.bank_name ?? '-'}
          />
          <BankItem
            label="Branch"
            value={accountResponse?.bank_details?.[0]?.branch ?? '-'}
          />
          <BankItem
            label="Bank IFSC"
            value={accountResponse?.bank_details?.[0]?.ifsc ?? '-'}
          />
          <BankItem
            label="Bank Verification Status"
            value={accountResponse?.bank_details?.[0]?.status ?? 'Not Updated'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const BankItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">
      <CopyButton className="h-min p-0" value={value}>
        {value}
      </CopyButton>
    </span>
  </div>
)

const VABankDetailsAccordion = ({
  accountResponse,
}: {
  accountResponse: AccountResponseById
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="va-bank-details">
      <AccordionTrigger>VA Bank Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <VABankItem
            label="Account Number"
            value={
              accountResponse?.wallet_bank_details?.[0]?.accountNumber ?? '-'
            }
          />
          <VABankItem
            label="IFSC"
            value={accountResponse?.wallet_bank_details?.[0]?.ifsc ?? '-'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const VABankItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label ? label : '-'}</span>
    <span className="text-foreground font-medium">
      <CopyButton className="h-min p-0" value={value}>
        {value ? value : '-'}
      </CopyButton>
    </span>
  </div>
)

const WalletDetailsAccordion = ({
  accountResponse,
}: {
  accountResponse: AccountResponseById
}) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="wallet-details">
      <AccordionTrigger>Wallet Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <WalletItem
            label="Vendor Name"
            value={accountResponse?.wallet_details?.vendor_name ?? '-'}
          />
          <WalletItem
            label="Provider Name"
            value={accountResponse?.wallet_details?.provider_name ?? '-'}
          />
          <WalletItem
            label="Migrated"
            value={accountResponse?.wallet_details?.migrated ? 'True' : 'False'}
          />
          <WalletItem
            label="Acknowledged"
            value={
              accountResponse?.wallet_details?.acknowledged ? 'True' : 'False'
            }
          />
          <WalletItem
            label="Acknowledged At"
            value={accountResponse?.wallet_details?.acknowledged_at ?? '-'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const WalletItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">
      <CopyButton className="h-min p-0" value={value}>
        {value}
      </CopyButton>
    </span>
  </div>
)

const FundItem = ({
  title,
  value,
  colSpan = 1,
}: {
  title: string
  value: string
  colSpan?: number
}) => (
  <div className={`col-span-${colSpan}`}>
    <div className="text-sm text-muted-foreground">{title}</div>
    <div>{value}</div>
  </div>
)

const SummaryItem = ({
  title,
  value,
  valueClass = '',
}: {
  title: string
  value: string
  valueClass?: string
}) => (
  <div className="flex justify-between">
    <span>{title}</span>
    <span className={valueClass}>
      <CopyButton className="h-min p-0" value={value}>
        {value}
      </CopyButton>
    </span>
  </div>
)

const AccountDetailsPage = () => {
  const params = useParams()
  const slug = params?.slug as string
  const { toast } = useToast()
  const [addCoins, setAddCoins] = useState<string>('')
  const [isLoadingAddCoins, setIsLoadingAddCoins] = useState(false)
  const [openAddFundsModal, setOpenAddFundsModal] = useState(false)
  const [openWithdrawTransactionModal, setOpenWithdrawTransactionModal] =
    useState(false)
  const [
    openCoinWithdrawTransactionModal,
    setOpenCoinWithdrawTransactionModal,
  ] = useState(false)

  const {
    data: accountResponse,
    isLoading, 
    refetch,
  } = useQuery<AccountResponseById>({
    queryKey: ['account', slug],
    queryFn: async () => {
      const parts = slug?.split('-')
      const accountType = parts?.[0]
      const accountId = parts?.slice(1).join('-')

      if (accountType && accountId) {
        return await getAccount(accountType, accountId)
      }
      throw new Error('Invalid slug')
    },
    enabled: !!slug,
  })

  const handleAddCoins = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingAddCoins(true)
    if (accountResponse?.wallet_id) {
      try {
        const response = await manualCoinTransfer(
          Number(addCoins),
          accountResponse?.account_id
        )
        if (response?.status === 201) {
          refetch()
          setAddCoins('')
          toast({
            description: response?.data?.message || 'Coins added successfully',
            variant: 'default',
          })
        }
      } catch (err) {
        console.error(err)
        toast({
          description: 'Failed to add coins',
          variant: 'destructive',
        })
      } finally {
        setIsLoadingAddCoins(false)
      }
    } else {
      toast({
        description: 'Account wallet id is missing',
        variant: 'destructive',
      })
      setIsLoadingAddCoins(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!accountResponse || !accountResponse) return <div>No account details found</div>

  const accountData = accountResponse

  return (
    <div className="flex flex-col rounded-lg md:flex-row justify-between w-full relative text-foreground">
      <div className="space-y-6 w-[50%] ">
        <div>
          <h2 className="text-xl mb-2">
            Account ID:{' '}
            <span className="text-primary">
              {accountData?.gui_account_id ?? '-'}
            </span>
          </h2>
        </div>

        <ContactAccordion accountResponse={accountData} />
        <IdentityAccordion accountResponse={accountData} />
        <BankDetailsAccordion accountResponse={accountData} />
        <VABankDetailsAccordion accountResponse={accountData} />
        <WalletDetailsAccordion accountResponse={accountData} />

        <div className="mt-8">
          <h3 className="text-lg mb-4">Funds</h3>
          <div className="grid grid-cols-2 gap-4">
            <FundItem
              title="Total PE Investment"
              value={`₹ ${
                accountData?.user_funds?.total_investment ?? '-'
              }`}
            />
            <FundItem
              title="Current Value"
              value={`₹ ${accountData?.user_funds?.current_value ?? '-'}`}
            />
            <FundItem
              title="PNL"
              value={`₹ ${accountData?.user_funds?.pnl ?? '-'}`}
            />
            <FundItem
              title="PNL Percentage"
              value={`${accountData?.user_funds?.pnl_percentage ?? '-'}%`}
            />
            <FundItem
              title="Current Value"
              value={`₹ ${accountData?.user_funds?.current_value ?? '-'}`}
              colSpan={2}
            />
            <FundItem
              title="Accrued Returns"
              value={`₹ ${
                accountData?.aroh_user_funds?.accrued_returns ?? '-'
              }`}
            />
            <FundItem
              title="Total Investment"
              value={`₹ ${
                accountData?.user_funds?.total_investment ?? '-'
              }`}
              colSpan={2}
            />
          </div>
        </div>
      </div>

      <Card className="w-content shadow-none h-min border border-border">
        <CardHeader>
          <CardTitle>Account Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <SummaryItem
              title="Balance"
              value={`₹${accountData?.user_funds?.balance ?? '-'}`}
            />
            <SummaryItem
              title="Withdrawable"
              value={`₹${accountData?.wallet_withdraw_amount ?? '-'}`}
            />
            <SummaryItem
              title="Coins"
              value={accountData?.coins?.toString() ?? '-'}
            />
            <SummaryItem
              title="Approval Status"
              value={accountData?.status ?? '-'}
              valueClass=""
            />
          </div>
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Enter coins"
                value={addCoins}
                onChange={(e) => setAddCoins(e.target.value)}
                className="flex-grow"
              />
              <Button
                onClick={handleAddCoins}
                disabled={isLoadingAddCoins || !addCoins}
              >
                {isLoadingAddCoins ? 'Adding...' : 'Add coins'}
              </Button>
            </div>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setOpenCoinWithdrawTransactionModal(true)}
            >
              Withdraw coins
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setOpenWithdrawTransactionModal(true)}
            >
              Withdraw funds
            </Button>
            <Button
              variant="default"
              className="w-full"
              onClick={() => setOpenAddFundsModal(true)}
            >
              Add funds
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddFundsModal
        openAddFundsModal={openAddFundsModal}
        setOpenAddFundsModal={setOpenAddFundsModal}
        getAccountRefetch={refetch}
        decentroWalletId={accountData?.decentro_wallet_id ?? ''}
        accountId={accountData?.account_id ?? ''}
      />
      <CreateAWithdrawTransaction
        accountId={accountData?.account_id ?? ''}
        balance={accountData?.wallet_balance ?? ''}
        openWithdrawTransactionModal={openWithdrawTransactionModal}
        setOpenWithdrawTransactionModal={setOpenWithdrawTransactionModal}
        refetch={refetch}
      />
      <CreateCoinWithdrawTransaction
        openCoinWithdrawTransactionModal={openCoinWithdrawTransactionModal}
        setOpenCoinWithdrawTransactionModal={setOpenCoinWithdrawTransactionModal}
        accountId={accountData?.account_id ?? ''}
        refetch={refetch}
        coinBalance={accountData?.coins ?? 0}
      />
    </div>
  )
}

export default AccountDetailsPage