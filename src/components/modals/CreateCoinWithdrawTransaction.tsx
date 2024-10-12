import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { manualCoinWithdraw } from "@/lib/api/coinApi";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

interface CreateCoinWithdrawTransactionProps {
  openCoinWithdrawTransactionModal: boolean;
  setOpenCoinWithdrawTransactionModal: (value: boolean) => void;
  accountId: string;
  coinBalance?: number | string
  refetch: () => void
}

const CreateCoinWithdrawTransaction = ({
  openCoinWithdrawTransactionModal,
  setOpenCoinWithdrawTransactionModal,
  accountId,
  coinBalance,
  refetch,
}: CreateCoinWithdrawTransactionProps): React.ReactElement => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const validationSchema = Yup.object().shape({
    coin: Yup.number()
      .max(
        Number(coinBalance),
        "Coins cannot be greater than the available coins"
      )
      .typeError("Please enter a valid number")
      .required("Please enter the number of coins to be deducted"),
    note: Yup.string(),
  });

  const form = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      coin: "",
      note: "",
    },
  });

  const handleModalClose = () => {
    form.reset();
    setOpenCoinWithdrawTransactionModal(false);
  };

  const onSubmit = async (data: { coin: number; note: string }) => {
    setIsLoading(true);
    try {
      const response = await manualCoinWithdraw({
        accountId: accountId,
        coins: Number(data.coin),
        note: data.note ?? "",
      });
      setIsLoading(false);
      toast({
        title: response?.data?.message,
        variant: "default",
      });
      refetch();
      handleModalClose();
    } catch (err: any) {
      toast({
        title: err?.response?.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openCoinWithdrawTransactionModal} onOpenChange={handleModalClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Withdraw Coin Transaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="coin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coins</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Enter the number of coins to be deducted"
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value ? Number(Number(value).toFixed(2)) : "");
                      }}
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
                    <Input {...field} placeholder="Add a note (optional)" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCoinWithdrawTransaction;