import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckIcon, XIcon, ClockIcon, CopyIcon } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/router";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { capitalize, getNumberInRupee } from "@/utils/utils";
import { getAccount, getAccountWalletTransactionsById } from "@/lib/api/transactionsApi";

interface AccountWalletTransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction_id: string;
  setLoading: (value: boolean) => void;
}

const AccountWalletTransactionDetails = ({
  isOpen,
  onClose,
  transaction_id,
  setLoading,
}: AccountWalletTransactionDetailsProps): React.ReactElement => {
  const { toast } = useToast();
//   const router = useRouter();

  const { data: transactionData, isLoading: isTransactionLoading } = useQuery({
    queryKey: ["transaction_details", transaction_id],
    queryFn: () => getAccountWalletTransactionsById(transaction_id),
  });

  const transaction = transactionData?.transactions;

  const { data: accountData, isLoading: isAccountLoading } = useQuery({
    queryKey: ["account_details", transaction?.account_id],
    queryFn: () => getAccount("PE", transaction?.account_id),
    enabled: !!transaction?.account_id,
  });

  const status = transaction?.status || "";
  const statusInfo = {
    color: status.toLowerCase() === "success" || status.toLowerCase() === "completed" ? "text-green-500" :
           status.toLowerCase() === "rejected" || status.toLowerCase() === "faliure" ? "text-red-500" : "text-yellow-500",
    icon: status.toLowerCase() === "success" || status.toLowerCase() === "completed" ? CheckIcon :
          status.toLowerCase() === "rejected" || status.toLowerCase() === "faliure" ? XIcon : ClockIcon
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
      description: "Value copied to clipboard",
      duration: 1500,
    });
  };

  const DetailRow = ({ label, value, copyable = false }) => (
    <div className="py-1 flex justify-between items-center">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <div className="flex items-center">
        <span className="text-base font-semibold text-right">
          {value || "-"}
        </span>
        {copyable && (
          <CopyIcon
            className="ml-2 h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={() => copyToClipboard(value)}
          />
        )}
      </div>
    </div>
  );



  const getSheetContent = () => {
    if (isTransactionLoading || isAccountLoading) {
      return (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="space-y-1">
          <DetailRow label="Transaction ID" value={transaction?.wallet_transaction_id} copyable />
          <DetailRow label="Vendor Transaction ID" value={transaction?.vendor_wallet_transaction_id} copyable />
          <DetailRow label="Vendor Wallet Id" value={transaction?.vendor_wallet_id} copyable />
          <DetailRow label="Vendor Transaction Id" value={transaction?.vendor_transaction_id} copyable />
          <DetailRow label="Account Id" value={transaction?.account_id} copyable />
          <DetailRow
            label="Account Name"
            value={
              <Button
                size="sm"
                onClick={() => handleAccountDetail(accountData)}
                className="font-semibold"
              >
                {capitalize(accountData?.contact?.name)}
              </Button>
            }
          />
          <DetailRow label="Wallet Id" value={transaction?.wallet_id} copyable />
          <DetailRow label="Gui Wallet Transaction Id" value={transaction?.gui_wallet_transaction_id} copyable />
          <DetailRow label="Order ID" value={transaction?.order_id} copyable />
          <DetailRow label="Payment Type" value={transaction?.payment_type} copyable />
          <DetailRow label="Portal" value={transaction?.portal} copyable />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow label="Reference Id" value={transaction?.reference_id} copyable />
          <DetailRow label="Reference Number" value={transaction?.reference_number} />
          <DetailRow label="Amount" value={getNumberInRupee(transaction?.amount, true)} />
          <DetailRow label="GST Charges" value={getNumberInRupee(transaction?.charges_gst, true)} />
          <DetailRow label="Settled Amount" value={getNumberInRupee(transaction?.settled_amount, true)} />
          <DetailRow label="Closing Balance" value={getNumberInRupee(transaction?.account_balance, true)} />
          <DetailRow label="Withdraw Amount" value={getNumberInRupee(transaction?.withdraw_amount, true)} />
          <DetailRow label="Transaction Type" value={transaction?.user_transaction_type} />
          <DetailRow label="Direction" value={transaction?.credit_debit} />
          <DetailRow
            label="Status"
            value={
              <Badge variant="outline" className={`${statusInfo.color} ml-2`}>
                {transaction?.status}
              </Badge>
            }
          />
          <DetailRow label="Transaction Amount" value={getNumberInRupee(transaction?.transaction_amount, true)} />
          <DetailRow label="Transaction Time" value={moment(transaction?.transaction_time).format("MM.DD.YYYY hh:mm a")} />
          <DetailRow label="Transaction Type" value={transaction?.transaction_type} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow label="Beneficiary Account IFSC" value={transaction?.bene_account_ifsc} copyable />
          <DetailRow label="Beneficiary Account Number" value={transaction?.bene_account_number} copyable />
          <DetailRow label="Beneficiary Account Type" value={transaction?.bene_account_type} />
          <DetailRow label="Beneficiary Code" value={transaction?.bene_code} />
          <DetailRow label="Sender Account Number" value={transaction?.sender_account_number} copyable />
          <DetailRow label="Sender Account IFSC" value={transaction?.sender_account_ifsc} copyable />
          <DetailRow label="User Transaction Type" value={transaction?.user_transaction_type} />
          <DetailRow label="RMTR Account IFSC" value={transaction?.rmtr_account_ifsc} copyable />
          <DetailRow label="RMTR Account Number" value={transaction?.rmtr_account_no} copyable />
          <DetailRow label="RMTR Full Name" value={transaction?.rmtr_full_name} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow label="UPI Transaction Id" value={transaction?.upi_transaction_id} copyable />
          <DetailRow label="Upi Id" value={transaction?.upi_id} copyable />
          <DetailRow label="UPI Payer Mobile" value={transaction?.upi_payer_mobile} copyable />
          <DetailRow label="UPI Payer Name" value={transaction?.upi_payer_name} />
          <DetailRow label="Vendor Name" value={transaction?.vendor_name} />
          <DetailRow label="Vendor Order Id" value={transaction?.vendor_order_id} copyable />
          <DetailRow label="Vendor Status" value={transaction?.vendor_status} />
          <DetailRow label="Precize Transaction Type" value={transaction?.precize_transaction_type} />
          <DetailRow label="Provider Name" value={transaction?.provider_name} />
          <DetailRow label="Provider Code" value={transaction?.provider_code} />
          <DetailRow label="Reason" value={transaction?.reason} />
          <DetailRow label="Decentro Transaction Id" value={transaction?.decentro_transaction_id} copyable />
          <DetailRow label="Created By" value={transaction?.created_by} />
          <DetailRow label="Credited At" value={moment(transaction?.credited_at).format("MM.DD.YYYY hh:mm a")} />
          <DetailRow label="Note" value={transaction?.note} />
        </div>
        <Separator className="my-4" />
        <div className="space-y-1">
          <DetailRow label="Created At" value={moment(transaction?.created_at).format("MM.DD.YYYY hh:mm a")} />
          <DetailRow label="Updated At" value={moment(transaction?.updated_at).format("MM.DD.YYYY hh:mm a")} />
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="min-w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Wallet Transaction Details</SheetTitle>
          <SheetDescription>View transaction details</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">{getSheetContent()}</div>
      </SheetContent>
    </Sheet>
  );
};

export default AccountWalletTransactionDetails;
