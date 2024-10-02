import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { createAWithdrawTransaction } from "@/lib/api/fundApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface CreateAWithdrawTransactionProps {
  openWithdrawTransactionModal: boolean;
  setOpenWithdrawTransactionModal: (value: boolean) => void;
  accountId: string;
  balance?: number | string;
  refetch: any;
}

const CreateAWithdrawTransaction = ({
  openWithdrawTransactionModal,
  setOpenWithdrawTransactionModal,
  accountId,
  balance,
  refetch,
}: CreateAWithdrawTransactionProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validationSchema = Yup.object().shape({
    amount: Yup.number()
      .max(Number(balance))
      .typeError("Amount is required")
      .required("Amount is required"),
    transactionFees: Yup.string()
      .typeError("Transaction Fees is required")
      .nullable()
      .when("amount", (amount: any, schema: any) => {
        return schema.test({
          test: (approvedAmount: any) => {
            if (!approvedAmount) return true;
            return Number(approvedAmount) < Number(amount);
          },
          message:
            "Transaction Fees can not be greater then or equals to amount",
        });
      }),
    note: Yup.string(),
    pcWithdrawal: Yup.boolean().required("Please select the withdrawal type")
  });

  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      amount: "",
      transactionFees: "",
      settlementAmount: "",
      note: "",
      pcWithdrawal: false,
    },
  });

  const handleModalClose = () => {
    form.reset();
    setOpenWithdrawTransactionModal(false);
  };

  const onSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);
    const payload = {
      amount: Number(data?.amount),
      transactionFees: Number(data?.transactionFees),
      settlementAmount: Number(data?.settlementAmount),
      note: data?.note,
      pcWithdrawal: Boolean(data?.pcWithdrawal)
    };

    try {
      const response = await createAWithdrawTransaction(accountId, payload);
      setIsLoading(false);
      toast({
        title: `Transaction Withdrawal successfully`,
        status: "success",
        isClosable: true,
      });
      refetch();
      handleModalClose();
    } catch (err: any) {
      setIsLoading(false);
    }
  });

  // 1. if amount changes
  //    a. if pcWithdrawal is true transactionFees will be zero and settlementAmount is same as amount
  //    b. if pcWithdrawal is false transactionFees will be either user typed or bt default 0.0097 and accordingly amount will be calculated
  // 2. if transaction fees changes
  //    a. if pcWithdrawal is true it can't be changed and it will be zero only.
  //    b. if pcWithdrawal is false user can changes transaction fees and based on it the settlement amount will be calculated
  // 3. if pcWithdrawal changes
  //    a. transaction fees will be zero and settlement amount calculated accordingly
  //    b. transaction fees will be default or user typed and settlement amount calculated accordingly
  const calculateSettlementAmount = (event: string, value: string) => {
    const transactionFeesPercent = 0.0097;
    if (event === "amount") {
      const currentAmount = Number(value);
      const currentPCWithdrawal = form.getValues("pcWithdrawal");
      const currentTransactionFees = currentPCWithdrawal ? 0 : Number(Number(currentAmount * transactionFeesPercent))?.toFixed(2);
      form.setValue("amount", currentAmount, { shouldValidate: true });
      form.setValue("transactionFees", currentTransactionFees, { shouldValidate: true });
      form.setValue("settlementAmount", currentPCWithdrawal ? Number(value) : Number(currentAmount) - Number(currentTransactionFees), { shouldValidate: true });
    } else if (event === "transactionFees") {
      const currentAmount = form.getValues("amount");
      const currentPCWithdrawal = form.getValues("pcWithdrawal");
      const currentTransactionFees = currentPCWithdrawal ? 0 : Number(value);
      form.setValue("transactionFees", currentTransactionFees, { shouldValidate: true });
      form.setValue("settlementAmount", currentPCWithdrawal ? Number(currentAmount) : Number(currentAmount) - Number(currentTransactionFees), { shouldValidate: true });
    } else if (event === "pcWithdrawal") {
      const currentAmount = form.getValues("amount");
      const currentPCWithdrawal = value;
      const currentTransactionFees = currentPCWithdrawal ? 0 : (currentAmount * transactionFeesPercent)?.toFixed(2);
      form.setValue("transactionFees", currentTransactionFees, { shouldValidate: true });
      form.setValue("settlementAmount", currentPCWithdrawal ? Number(currentAmount) : Number(currentAmount) - Number(currentTransactionFees), { shouldValidate: true });
    }
  }

  const handleInputChange = (e: any) => {
    let value = e.target.value;
    const name = e.target.name;
    const regex = /^[0-9]*(\.[0-9]{0,2})?$/;
    if (name === "amount") {
      regex.test(value) && calculateSettlementAmount(name, value)
    } else if (name === "transactionFees") {
      regex.test(value) && calculateSettlementAmount(name, value)
    } else if (name === "pcWithdrawal") {
      value = e.target.checked
      calculateSettlementAmount(name, value)
      form.setValue("pcWithdrawal", value);
    } else if (name === "note") {
      form.setValue("note", value, { shouldValidate: true });
    }
  }

  return (
    <Dialog open={openWithdrawTransactionModal} onOpenChange={setOpenWithdrawTransactionModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create A Withdraw Transaction</DialogTitle>
          <DialogDescription>Enter the details for the withdrawal transaction.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter Amount"
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="transactionFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Fees</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter Transaction Fees"
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="settlementAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Settlement Amount</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled
                      placeholder="Enter Settlement Amount"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleInputChange(e);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pcWithdrawal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        handleInputChange({ target: { name: "pcWithdrawal", checked } });
                      }}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>PC Withdrawal</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Close
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Processing..." : "Confirm"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAWithdrawTransaction;
