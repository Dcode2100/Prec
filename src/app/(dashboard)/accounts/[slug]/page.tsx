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
import CreateAWithdrawTransaction from '@/components/modals/CreateAWithdrawTransaction'
import CreateCoinWithdrawTransaction from '@/components/modals/CreateCoinWithdrawTransaction'

// New types
type Contact = {
  name?: string
  email?: string
  mobile?: string
  whatsapp_notification?: boolean
  created_at?: string
  updated_at?: string
}

type Identity = {
  pan?: string
  pan_linked?: boolean
  pan_updated_at?: string
}

type BankDetails = {
  account_number?: string
  bank_name?: string
  branch?: string
  ifsc?: string
  verification_status?: string
}

type VABankDetails = {
  account_number?: string
  ifsc?: string
}

type WalletDetails = {
  vendor_name?: string
  provider_name?: string
  migrated?: boolean
  acknowledged?: boolean
  acknowledged_at?: string
}

type AccountDetails = {
  account_id: string
  wallet_id?: string
  contact: Contact
  bank_details?: BankDetails
  va_bank_details?: VABankDetails
  wallet_details?: WalletDetails
  aroh_user_funds?: {
    total_investment?: string
    current_value?: string
    accrued_returns?: string
  }
  user_funds?: {
    pnl?: string
    pnl_percentage?: string
    current_value?: string
    total_investment?: string
    balance?: string
  }
  wallet_withdraw_amount?: string
  coins?: number
  status?: string
  decentro_wallet_id?: string
  wallet_balance?: string
}

const ContactAccordion = ({ contact }: { contact: Contact }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="contact-details">
      <AccordionTrigger>Contact Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <ContactItem label="Full Name" value={contact?.name ?? '-'} />
          <ContactItem label="Email Address" value={contact?.email ?? '-'} />
          <ContactItem label="Mobile" value={contact?.mobile ?? '-'} />
          <ContactItem label="Demat Account No" value="-" />
          <ContactItem
            label="WhatsApp Notification"
            value={contact?.whatsapp_notification ? 'True' : 'False'}
          />
          <ContactItem label="Nominated By" value="Access Code" />
          <ContactItem label="Referred By" value="-" />
          <ContactItem label="UPI ID" value="-" />
          <ContactItem
            label="Created At"
            value={
              contact?.created_at
                ? new Date(contact.created_at).toLocaleString()
                : '-'
            }
          />
          <ContactItem
            label="Updated At"
            value={
              contact?.updated_at
                ? new Date(contact.updated_at).toLocaleString()
                : '-'
            }
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const ContactItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
)

const IdentityAccordion = ({ identity }: { identity: Identity }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="identity-details">
      <AccordionTrigger>Identity Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <IdentityItem label="PAN" value={identity?.pan ?? '-'} />
          <IdentityItem
            label="PAN Linked"
            value={identity?.pan_linked ? 'TRUE' : 'FALSE'}
          />
          <IdentityItem
            label="PAN Updated At"
            value={identity?.pan_updated_at ?? '-'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const IdentityItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
)

const BankDetailsAccordion = ({ bankDetails }: { bankDetails: BankDetails }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="bank-details">
      <AccordionTrigger>Bank Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <BankItem
            label="Account Number"
            value={bankDetails?.account_number ?? '-'}
          />
          <BankItem label="Bank Name" value={bankDetails?.bank_name ?? '-'} />
          <BankItem label="Branch" value={bankDetails?.branch ?? '-'} />
          <BankItem label="Bank IFSC" value={bankDetails?.ifsc ?? '-'} />
          <BankItem
            label="Bank Verification Status"
            value={bankDetails?.verification_status ?? 'Not Updated'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const BankItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
  </div>
)

const VABankDetailsAccordion = ({ vaBankDetails }: { vaBankDetails: VABankDetails }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="va-bank-details">
      <AccordionTrigger>VA Bank Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <VABankItem
            label="Account Number"
            value={vaBankDetails?.account_number ?? '-'}
          />
          <VABankItem label="IFSC" value={vaBankDetails?.ifsc ?? '-'} />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const VABankItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label ? label : '-'}</span>
    <span className="text-foreground font-medium">{value ? value : '-'}</span>
  </div>
)

const WalletDetailsAccordion = ({ walletDetails }: { walletDetails: WalletDetails }) => (
  <Accordion type="single" collapsible className="w-full">
    <AccordionItem value="wallet-details">
      <AccordionTrigger>Wallet Details</AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3">
          <WalletItem
            label="Vendor Name"
            value={walletDetails?.vendor_name ?? '-'}
          />
          <WalletItem
            label="Provider Name"
            value={walletDetails?.provider_name ?? '-'}
          />
          <WalletItem
            label="Migrated"
            value={walletDetails?.migrated ? 'True' : 'False'}
          />
          <WalletItem
            label="Acknowledged"
            value={walletDetails?.acknowledged ? 'True' : 'False'}
          />
          <WalletItem
            label="Acknowledged At"
            value={walletDetails?.acknowledged_at ?? '-'}
          />
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
)

const WalletItem = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium">{value}</span>
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
    <span className={valueClass}>{value}</span>
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
    data: accountDetails,
    isLoading,
    refetch,
  } = useQuery<AccountDetails | null>({
    queryKey: ['account', slug],
    queryFn: async () => {
      const parts = slug?.split('-')
      const accountType = parts?.[0]
      const accountId = parts?.slice(1).join('-')

      if (accountType && accountId) {
        return await getAccount(accountType, accountId)
      }
      return null
    },
    enabled: !!slug,
  })

  const handleAddCoins = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingAddCoins(true)
    if (accountDetails?.wallet_id) {
      try {
        const response = await manualCoinTransfer(
          Number(addCoins),
          accountDetails.account_id
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
  if (!accountDetails) return <div>No account details found</div>

  return (
    <div className="flex flex-col rounded-lg md:flex-row justify-between w-full relative text-foreground">
      <div className="space-y-6 w-[50%] ">
        <div>
          <h2 className="text-xl mb-2">
            Account ID:{' '}
            <span className="text-primary">{slug.split('-')[1] ?? '-'}</span>
          </h2>
        </div>

        <ContactAccordion contact={accountDetails?.contact as Contact} />

        <IdentityAccordion identity={accountDetails?.identity as Identity} />

        <BankDetailsAccordion bankDetails={accountDetails?.bank_details as BankDetails} />

        <VABankDetailsAccordion
          vaBankDetails={accountDetails?.va_bank_details as VABankDetails}
        />

        <WalletDetailsAccordion
          walletDetails={accountDetails?.wallet_details as WalletDetails}
        />

        <div className="mt-8">
          <h3 className="text-lg mb-4">Funds</h3>
          <div className="grid grid-cols-2 gap-4">
            <FundItem
              title="Total PE Investment"
              value={`₹ ${
                accountDetails?.aroh_user_funds?.total_investment ?? '0'
              }`}
            />
            <FundItem
              title="Current Value"
              value={`₹ ${
                accountDetails?.aroh_user_funds?.current_value ?? '0'
              }`}
            />
            <FundItem
              title="PNL"
              value={accountDetails?.user_funds?.pnl ?? '0'}
            />
            <FundItem
              title="PNL Percentage"
              value={`${accountDetails?.user_funds?.pnl_percentage ?? '0'}%`}
            />
            <FundItem
              title="Current Value"
              value={`₹ ${accountDetails?.user_funds?.current_value ?? '0'}`}
              colSpan={2}
            />
            <FundItem
              title="Accrued Returns"
              value={`₹ ${
                accountDetails?.aroh_user_funds?.accrued_returns ?? '0'
              }`}
            />
            <FundItem
              title="Total Investment"
              value={`₹ ${accountDetails?.user_funds?.total_investment ?? '0'}`}
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
              value={`₹${accountDetails?.user_funds?.balance ?? '0'}`}
            />
            <SummaryItem
              title="Withdrawable"
              value={`₹${accountDetails?.wallet_withdraw_amount ?? '0'}`}
            />
            <SummaryItem
              title="Coins"
              value={accountDetails?.coins?.toString() ?? '0'}
            />
            <SummaryItem
              title="Approval Status"
              value={accountDetails?.status ?? 'Unknown'}
              valueClass="text-accent"
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
        decentroWalletId={accountDetails?.decentro_wallet_id ?? ''}
        accountId={accountDetails?.account_id}
      />
      <CreateAWithdrawTransaction
        accountId={accountDetails?.account_id}
        balance={accountDetails?.wallet_balance}
        openWithdrawTransactionModal={openWithdrawTransactionModal}
        setOpenWithdrawTransactionModal={setOpenWithdrawTransactionModal}
        refetch={refetch}
      />
      <CreateCoinWithdrawTransaction
        openCoinWithdrawTransactionModal={openCoinWithdrawTransactionModal}
        setOpenCoinWithdrawTransactionModal={
          setOpenCoinWithdrawTransactionModal
        }
        accountId={accountDetails.account_id}
        refetch={refetch}
        coinBalance={accountDetails.coins}
      />
    </div>
  )
}

export default AccountDetailsPage