import React, { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { AccountResponse, AccountsParams } from '@/lib/types/types'
import { getAccounts } from '@/lib/api/accountApi'
import { transferHolding } from '@/lib/api/holdingApi'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface TransferHoldingModalProps {
  isOpen: boolean
  onClose: () => void
  holdingId: string
  sendersAccountId: string
  onTransferSuccess: () => void
}

const TransferHoldingModal: React.FC<TransferHoldingModalProps> = ({
  isOpen,
  onClose,
  holdingId,
  sendersAccountId,
  onTransferSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] =
    useState<AccountResponse | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const toast = useToast()

  const fetchAccounts = async () => {
    const params: AccountsParams = {
      search: searchTerm,
      page: 1,
      limit: 10,
    }
    return await getAccounts(params)
  }

  const { data: accountsData, isLoading: isSearchLoading } = useQuery({
    queryKey: ['accounts', searchTerm],
    queryFn: fetchAccounts,
    // {
    //   enabled: searchTerm.length > 2,
    //   cacheTime: 0,
    // }
  })

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value)
    }, 300),
    []
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const handleSelectAccount = (account: AccountResponse) => {
    setSelectedAccount(account)
    setSearchTerm('')
  }

  const handleTransfer = () => {
    setIsConfirmOpen(true)
  }

  const handleConfirmTransfer = async () => {
    setIsLoading(true)
    try {
      if (!selectedAccount) {
        throw new Error('No target account selected')
      }

      await transferHolding({
        from_investor_id: sendersAccountId,
        to_investor_id: selectedAccount.account_id,
        holding_ids: [holdingId],
      })

      toast.toast({
        description: 'Holding transfer completed',
        variant: 'success',
      })
      onTransferSuccess()
      handleModalClose()
    } catch (err) {
      toast.toast({
        description: 'Error transferring holding',
        variant: 'destructive',
      })
    }
    setIsLoading(false)
    setIsConfirmOpen(false)
  }

  const handleModalClose = () => {
    setSelectedAccount(null)
    setSearchTerm('')
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Transfer Holding</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder="Search accounts..."
              onChange={handleSearch}
              value={searchTerm}
              className="col-span-3"
            />
            {isSearchLoading ? (
              <p className="text-sm text-muted-foreground">Loading...</p>
            ) : (
              Array.isArray(accountsData) && accountsData.map((account) => (
                <Button
                  key={account.account_id}
                  variant="outline"
                  onClick={() => handleSelectAccount(account)}
                  className="justify-start"
                >
                  {account.gui_account_id} - {account.first_name} {account.last_name}
                </Button>
              ))
            )}
            {selectedAccount && (
              <p className="text-sm font-medium">
                Selected: {selectedAccount.gui_account_id} -{' '}
                {selectedAccount.first_name} {selectedAccount.last_name}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleModalClose}>
              Cancel
            </Button>
            <Button
              onClick={handleTransfer}
              disabled={!selectedAccount || isLoading}
            >
              Transfer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transfer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to transfer to{' '}
              {selectedAccount?.gui_account_id} - {selectedAccount?.first_name}{' '}
              {selectedAccount?.last_name}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmTransfer}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default TransferHoldingModal
