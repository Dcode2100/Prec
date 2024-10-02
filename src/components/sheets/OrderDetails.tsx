import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/Loader";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import CopyButton from "@/components/CopyButton";
import { capitalize, getNumberInRupee } from "@/utils/utils";
import {
  getOrdersById,
  updateOrderStatusById,
  updateArohOrderStatusById,
  uploadPdf,
  getSellOrdersById,
  updateOrderById,
} from "@/lib/api/ordersApi";
import router from "next/router";
import { getGlobalItem } from "@/utils/utils";
// import Invoice from "../pdf/Invoice";
// import NSEInvoice from "../pdf/NSEInvoice";
import Link from "next/link";
// import colors from "../theme/colors";
// import RefundModal from "@/components/modals/RefundModal";
import moment from "moment";

interface OrderDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  order_id: string;
  order: any;
  setLoading: Function;
  page?: any;
  dataUpdate?: boolean;
  setDataUpdate?: any;
}

const OrderDetails = (props: OrderDetailsProps): React.ReactElement => {
  const order_id = props.order_id;
  const [updateSelectedStatus, setUpdateSelectedStatus] = useState("");
  const [isUpdate, setIsUpdate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadPdfLoading, setUploadPdfLoading] = useState(false);
  const [isNote, setIsNote] = useState("");
  const { toast } = useToast();
  const isAffiliate = getGlobalItem("isAffiliate");
  const [dematAccount, setDematAccount] = useState<string>("");

  const fetchOrderDetails = () => {
    return props.page
      ? getSellOrdersById(order_id, "PE")
      : getOrdersById(order_id, "PE");
  };

  const [isOpenRefundModal, setIsOpenRefundModal] = useState<boolean>(false);

  const orderDetailsQuery = useQuery(
    ["order_details", order_id],
    fetchOrderDetails
  );

  const order = orderDetailsQuery.data;
  const transferable = order?.data?.transferable;

  const orderStatus = order?.data?.status || "";

  const copyDetail = (label: string, value: string | undefined) => (
    <DetailRow label={label} key={value}>
      <CopyButton value={value || ""} />
    </DetailRow>
  );

  const orderDetail = (
    label: string,
    value: string | any,
    statusColor?: string
  ) => (
    <DetailRow label={label} key={label}>
      <span
        className={cn(
          "text-sm font-semibold",
          statusColor ? statusColor : "text-muted-foreground"
        )}
      >
        {value || "-"}
      </span>
    </DetailRow>
  );

  const moneyDetail = (label: string, value: number | undefined) => (
    <DetailRow label={label} key={value}>
      <span className="text-sm font-semibold">
        {typeof value !== "undefined" ? getNumberInRupee(value) : "-"}
      </span>
    </DetailRow>
  );

  const dateDetail = (label: string, date: moment.Moment | undefined) => (
    <DetailRow label={label}>
      <div className="flex items-center">
        <span className="text-xs font-semibold text-muted-foreground mr-1">
          {!date ? "" : date.format("hh:mm a")}
        </span>
        <span className="text-sm font-semibold">
          {!date ? "-" : date.format("MM.DD.YYYY")}
        </span>
      </div>
    </DetailRow>
  );

  const sideDetails = !props.page && (
    <DetailRow label="Side">
      <span
        className={cn(
          "text-sm font-semibold",
          order?.data?.side.toLowerCase() === "buy" ? "text-green-500" : "text-red-500"
        )}
      >
        {capitalize(order?.side)}
      </span>
    </DetailRow>
  );

  const getDrawerContent = () => {
    if (orderDetailsQuery.isLoading) {
      return (
        <div className="space-y-4 opacity-50 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      );
    }

    let status = "";
    let statusColor = "";

    if (["COMPLETED", "SUCCESS"].includes(orderStatus)) {
      status = "Completed";
      statusColor = "text-green-500";
    } else if (["REJECTED", "FAILED"].includes(orderStatus)) {
      status = "Rejected";
      statusColor = "text-red-500";
    } else if (["PENDING"].includes(orderStatus)) {
      status = "Pending";
      statusColor = "text-yellow-500";
    } else if (["CANCELLED"].includes(orderStatus)) {
      status = "Cancelled";
      statusColor = isAffiliate ? "text-gray-500" : "text-red-500";
    } else if (["TRANSFER_PENDING"].includes(orderStatus)) {
      status = "Transfer Pending";
      statusColor = "text-yellow-500";
    } else if (["VERIFICATION_PENDING"].includes(orderStatus)) {
      status = "Verification Pending";
      statusColor = "text-yellow-500";
    } else if (["LOCKED"].includes(orderStatus) && !transferable) {
      status = "Locked";
      statusColor = "text-yellow-500";
    } else {
      statusColor = "text-yellow-500";
    }

    const totalPurchaseValue =
      +order?.data?.amount +
      (+order?.data?.stampDuty ? +order?.data?.stampDuty : 0) +
      (+order?.data?.transactionFee ? +order?.data?.transactionFee : 0);

    const PeOrderStatus: any = !transferable
      ? {
          VERIFICATION_PENDING: "Verification Pending",
          SIGN_AGREEMENT: "Sign Agreement",
          ADD_IDENTITY_DETAILS: "Add Identity Details",
          CONFIRM_IDENTITY_DETAILS: "Confirm Identity Details",
          LOCKED: "Locked",
          TRANSFER_PENDING: "Transfer Pending",
          INVALID: "Invalid",
          SUCCESS: "Completed",
        }
      : {
          SUCCESS: "Completed",
          TRANSFER_PENDING: "Transfer Pending",
          INVALID: "Invalid",
        };

    const updateStatus = async () => {
      const reason = "";
      setIsLoading(true);
      const response = props.page
        ? await updateArohOrderStatusById(
            "aroh",
            order?.data?.order_id,
            updateSelectedStatus,
            reason
          )
        : await updateOrderStatusById(
            "PE",
            order?.data?.order_id,
            updateSelectedStatus,
            reason
          );

      if (response.status) {
        toast({
          title: "Order Status Updated Successfully",
          description: "",
          variant: "success",
        });
        props.setLoading(false);
        setIsUpdate(true);
        setIsLoading(false);
        props.onClose();
        props.setDataUpdate(!props.dataUpdate);
      } else {
        props.setLoading(false);
        setIsLoading(true);
        props.onClose();
      }
    };

    const handleNote = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const notData = e.target.value;
      setIsNote(notData);
    };

    const handleUpdate = async () => {
      const payload = {
        note: isNote ? isNote : order?.data?.note,
        boId: dematAccount ? dematAccount : order?.data?.bo_id,
      };
      setIsLoading(true);
      const response = await updateOrderById(order?.data?.order_id, payload);
      if (response.status) {
        orderDetailsQuery.refetch();
        toast({
          title: response?.data?.message,
          description: "",
          variant: "success",
        });
        props.setLoading(false);
        setIsUpdate(true);
        setIsLoading(false);
        props.onClose();
      } else {
        props.setLoading(false);
        setIsLoading(true);
        props.onClose();
      }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const fileToUpload = e.target.files?.[0];
      if (!fileToUpload) return;

      const formData = new FormData();
      formData.append("signAgreement", fileToUpload);
      formData.append("fileType", "application/pdf");
      setUploadPdfLoading(true);
      try {
        let data = await uploadPdf(order?.data?.order_id, formData);
        orderDetailsQuery.refetch();
        toast({
          title: data?.message,
          description: "",
          variant: "success",
        });
      } catch (e: any) {}
      setUploadPdfLoading(false);
    };

    return (
      <>
        <RefundModal
          openRefundModal={isOpenRefundModal}
          setOpenRefundModal={setIsOpenRefundModal}
          order_id={order_id}
          transactionAmount={+order?.data?.purchase_value}
          dataUpdate={props?.dataUpdate}
          setDataUpdate={props?.setDataUpdate}
          onClose={props.onClose}
        />
        <SheetHeader>
          <SheetTitle>Order Details</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {copyDetail("Order ID", order?.data?.gui_order_id)}
          {copyDetail("Order UUID", order?.data?.order_id)}
          {copyDetail("Account ID", order?.data?.gui_account_id)}
          {orderDetail(
            "Account Name",
            <a
              href={`/accounts/PE/${order?.data?.account_id}`}
              className={cn(
                "bg-yellow-500 text-bg-dark px-2 py-1 rounded-md",
                colors.yellow,
                "px-2 py-1 rounded-md"
              )}
            >
              {capitalize(
                order?.data?.side === "Sell"
                  ? order?.data?.contact_person
                  : order?.data?.name
              )}
            </a>
          )}
          {copyDetail("Account Email", order?.data?.email)}
          {copyDetail("Demat Account Number", order?.data?.bo_id)}
          {copyDetail("Mobile", order?.data?.mobile)}
          {router?.pathname === "/delivery_journey/" && (
            <Separator className="my-4" />
          )}
          {router?.pathname === "/delivery_journey/" &&
            copyDetail(
              "Account Number",
              order?.data?.bank_details[0]?.account_number
            )}
          {router?.pathname === "/delivery_journey/" &&
            copyDetail("IFSC Code", order?.data?.bank_details[0]?.ifsc)}
          {router?.pathname === "/delivery_journey/" &&
            copyDetail("Bank Name", order?.data?.bank_details[0]?.bank_name)}
          {router?.pathname === "/delivery_journey/" &&
            copyDetail("Branch Name", order?.data?.bank_details[0]?.branch)}
          <Separator className="my-4" />
          {orderDetail("Token", order?.data?.token)}
          {orderDetail("Symbol", order?.data?.symbol)}
          {orderDetail("Price", order?.data?.price)}
          {orderDetail("Quantity", order?.data?.quantity?.toString())}
          {orderDetail("Total Investment", "₹ " + order?.data?.amount)}
          {order?.data?.stampDuty !== undefined
            ? orderDetail("Stamp Duty", "₹ " + order?.data?.stampDuty)
            : orderDetail("Stamp Duty", "₹ " + order?.data?.stamp_duty)}
          {order?.data?.transactionFee !== undefined
            ? orderDetail("Transaction Fee", "₹ " + order?.data?.transactionFee)
            : orderDetail(
                "Transaction Fee",
                "₹ " + order?.data?.transaction_fee
              )}
          {orderDetail("GST", "₹ " + order?.data?.gst)}
          {orderDetail("Documentation Charges", "₹ " + order?.data?.documentation_charges)}
          {props.page !== "Sell" &&
            orderDetail("Coins Used", order?.data?.coins)}
          {orderDetail(
            "Total Purchase Value",
            "₹ " + (+order?.data?.purchase_value).toFixed(2)
          )}
          {!props.page && (
            <DetailRow label="Side">
              <span
                className={cn(
                  "text-sm font-semibold",
                  order?.data?.side === "Buy" ? "text-green-500" : "text-red-500"
                )}
              >
                {order?.data?.side}
              </span>
            </DetailRow>
          )}
          {props.page !== "Sell" && (
            <Separator className="my-4" hidden={isAffiliate} />
          )}
          {!isAffiliate && props.page !== "Sell" && (
            <div className="space-y-4">
              <Label>Status</Label>
              <Select
                onValueChange={(value) => setUpdateSelectedStatus(value)}
                defaultValue={orderStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PeOrderStatus).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                onClick={updateStatus}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="mr-2" /> : null}
                Update Status
              </Button>
            </div>
          )}
          {isAffiliate && orderDetail("Status", status, statusColor)}
          {props.page !== "Sell" && (
            <Separator className="my-4" hidden={isAffiliate} />
          )}
          {!isAffiliate && props.page !== "Sell" && (
            <div className="space-y-4">
              <Label>Update Demat Account</Label>
              <Input
                placeholder="Update Demat Account"
                defaultValue={order?.data?.bo_id}
                onChange={(e) => setDematAccount(e.target.value)}
              />
              <Label>Add Note</Label>
              <Textarea
                defaultValue={order?.data?.note}
                onChange={handleNote}
              />
              <Button
                variant="outline"
                onClick={handleUpdate}
                disabled={isLoading}
              >
                {isLoading ? <Loader className="mr-2" /> : null}
                Update
              </Button>
            </div>
          )}
          {order?.data?.status === "SUCCESS" && (
            <div className="mt-4">
              <Invoice
                data={order?.data}
                paymentDate={order?.data?.payment_date}
              />
            </div>
          )}
          {(order?.data?.status === "SIGN_AGREEMENT" ||
            order?.data?.status === "VERIFICATION_PENDING" ||
            order?.data?.status === "LOCKED") && (
            <div className="mt-4">
              <label
                className={cn(
                  "border border-yellow-500 text-yellow-500 px-4 py-2 rounded-md flex items-center justify-center cursor-pointer",
                  uploadPdfLoading ? "opacity-50 cursor-not-allowed" : ""
                )}
                htmlFor="uploadPdf"
              >
                {uploadPdfLoading ? (
                  <Loader className="mr-2" />
                ) : (
                  "Upload"
                )}
              </label>
              <Input
                id="uploadPdf"
                type="file"
                accept="application/pdf"
                onChange={handleUpload}
                className="hidden"
              />
            </div>
          )}
          {!transferable && (
            <div className="mt-4">
              <NSEInvoice data={{ ...order?.data, isUnsigned: true }} />
            </div>
          )}
          {!transferable &&
            (order?.data?.sign_agreement !== null ? (
              <div className="mt-4">
                <Link href={order?.data?.sign_agreement}>
                  <a download={true} target="_blank">
                    <Button variant="outline">Download Signed Agreement</Button>
                  </a>
                </Link>
              </div>
            ) : (
              <div className="mt-4">
                <NSEInvoice data={{ ...order?.data, isUnsigned: false }} />
              </div>
            ))}
          {(order?.data?.status === "TRANSFER_PENDING" ||
            order?.data?.status === "VERIFICATION_PENDING" ||
            order?.data?.status === "ADD_IDENTITY_DETAILS" ||
            order?.data?.status === "CONFIRM_IDENTITY_DETAILS" ||
            order?.data?.status === "SIGN_AGREEMENT" ||
            order?.data?.status === "LOCKED") && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpenRefundModal(true)}
              >
                Refund
              </Button>
            </div>
          )}
          <Separator className="my-4" />
          {dateDetail("Created At", moment(order?.data.created_at))}
          {dateDetail("Updated At", moment(order?.data?.updated_at))}
          {order?.data?.payment_date &&
            dateDetail(
              "Payment Date",
              order?.data?.payment_date
                ? moment(order?.data?.payment_date)
                : undefined
            )}
          {order?.data?.transfer_success_date &&
            dateDetail(
              "Transfer Success Date",
              order?.data?.transfer_success_date
                ? moment(order?.data?.transfer_success_date)
                : undefined
            )}
        </div>
      </>
    );
  };

  return (
    <Sheet open={props.isOpen} onOpenChange={props.onClose}>
      <SheetContent>{getDrawerContent()}</SheetContent>
    </Sheet>
  );
};

const DetailRow = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <div className="flex justify-between items-center">
    <Label className="text-sm font-medium text-muted-foreground">{label}</Label>
    <div>{children}</div>
  </div>
);

export default OrderDetails;
  