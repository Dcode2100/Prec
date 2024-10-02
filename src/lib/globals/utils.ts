import moment from "moment";
import numeral from "numeral";
import { CronRecord } from "@/lib/types/getAllCronType";
import { Log, LogsData } from "@/lib/types/getAllLogsType";
import { PcHolding } from "@/lib/types/getAllPCHoldingsType";
import { PCHoldingById } from "@/lib/types/getPCHoldingByIdType";
import {
  RecentHoldings,
  RecentSubscriptionProcessedOrder,
  RecentSubscriptionProcessingOrder,
} from "@/lib/types/pcDeliveryType";
import { PCOrders } from "@/lib/types/PcEnquiryType";
import {
  AccountResponse,
  WishlistResponse,
  NominatorResponse,
  GetAccountResponse,
  Transfer,
  Document,
  Journal,
  AssetResponse,
  OrderResponse,
  assetsPeResponse,
  TransactionDetailResponse,
  NominatorAccountResponse,
  LamfResponse,
  HoldingsResponse,
  PennyDropTransactionResponse,
  UsersPanPendingResponse,
  PcAsset,
  PCWishlistResponse,
} from "@/lib/types/types";
import { Pe } from "@/lib/types/walletType";
import { getGlobalItem } from "@/utils/utils";
export const capitalize = (value: string | undefined, split = true): string => {
  if (!value) return "";
  if (split) value = value.split("_").join(" ");
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getNumberInRupee = (
  value: string | number,
  decimal: boolean = false
): string => `₹${numeral(value).format(`0,0${decimal ? ".00" : ""}`)}`;

export const ordersToTableRows = (orders: OrderResponse[] | undefined): any => {
  if (!orders) return [];
  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || "",
      order?.gui_account_id || "",
      order?.side || "",
      order?.symbol || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.price!,
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "PAYMENT_CONFIRMED"
          ? "Payment Pending"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const pcOrdersToTableRows = (orders: PCOrders[] | undefined): any => {
  if (!orders) return [];
  return orders.map((order: PCOrders, i) => {
    return [
      i + 1,
      order?.gui_id || "",
      order?.gui_account_id || "",
      capitalize(order?.symbol) || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.price!,
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "PAYMENT_CONFIRMED"
          ? "Payment Pending"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const recentSubscriptionOrdersToTableRows = (
  orders:
    | RecentSubscriptionProcessingOrder[]
    | RecentSubscriptionProcessedOrder[]
    | undefined
): any => {
  if (!orders) return [];
  return orders.map(
    (
      order:
        | RecentSubscriptionProcessingOrder
        | RecentSubscriptionProcessedOrder,
      i
    ) => {
      return [
        i + 1,
        order?.gui_id || "",
        order?.gui_account_id || "",
        capitalize(order?.symbol) || "",
        order?.price!,
        capitalize(order?.status?.split("_").join(" ")),
        moment(order?.created_at || ""),
      ];
    }
  );
};

export const recentHoldingsToTableRows = (
  holdings: RecentHoldings[] | undefined
): any => {
  if (!holdings) return [];
  return holdings.map((holding: RecentHoldings, i) => {
    return [
      i + 1,
      holding?.gui_id || "",
      capitalize(holding?.symbol) || "",
      holding?.price!,
      holding?.returns!,
      holding?.subscription_amount!,
      holding?.min_repayment_amount!,
      capitalize(holding?.status?.split("_").join(" ")),
      moment(holding?.created_at || ""),
    ];
  });
};

export const arohOrdersToTableRows = (
  orders: OrderResponse[] | undefined
): any => {
  if (!orders) return [];
  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || "",
      order?.gui_account_id || "",
      order?.symbol || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "PAYMENT_CONFIRMED"
          ? "Payment Pending"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const ordersAnalyticsToTableRows = (
  orders: OrderResponse[] | undefined
): any => {
  if (!orders) return [];

  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || "",
      order?.gui_account_id || "",
      order?.first_name + " " + order?.last_name || "",
      order?.symbol || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "ADD_BANK"
          ? "Didn't Add Bank"
          : order?.status === "CONFIRM_DEMAT"
          ? "Didn't Confirm Demat"
          : order?.status === "PLACE_ORDER"
          ? "Didn't Place Order"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const ordersAnalyticsPendingToTableRows = (
  orders: OrderResponse[] | undefined
): any => {
  if (!orders) return [];

  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || "",
      order?.gui_account_id || "",
      order?.gui_transaction_id || "",
      order?.first_name + " " + order?.last_name || "",
      order?.symbol || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "ADD_BANK"
          ? "Didn't Add Bank"
          : order?.status === "CONFIRM_DEMAT"
          ? "Didn't Confirm Demat"
          : order?.status === "PLACE_ORDER"
          ? "Didn't Place Order"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const ordersADeliveryToTableRows = (
  orders: OrderResponse[] | undefined
): any => {
  if (!orders) return [];

  return orders.map((order: OrderResponse, i) => {
    return [
      i + 1,
      order?.gui_order_id || "",
      order?.gui_account_id || "",
      order?.symbol || "",
      Number(order?.quantity > 0 ? order?.quantity : "0.00"),
      order?.status !== "SUCCESS"
        ? order?.status === "PENDING"
          ? "Payment" + " " + capitalize(order?.status.split("_").join(" "))
          : order?.status === "ADD_BANK"
          ? "Didn't Add Bank"
          : order?.status === "CONFIRM_DEMAT"
          ? "Didn't Confirm Demat"
          : order?.status === "PLACE_ORDER"
          ? "Didn't Place Order"
          : capitalize(order?.status.split("_").join(" "))
        : "Completed",
      moment(order?.created_at || ""),
    ];
  });
};

export const panPendingUsersToTableRows = (
  users: UsersPanPendingResponse[] | undefined
): any => {
  if (!users) return [];

  return users.map((user: UsersPanPendingResponse, i) => {
    return [
      i + 1,
      user?.gui_account_id || "",
      user?.email || "",
      user?.orders_count || "0",
      user?.portal_linked ? "TRUE" : "FALSE",
      user?.bo_id || "",
      user?.pan || "",
      user?.status !== "SUCCESS"
        ? user?.status === "PENDING"
          ? "Payment" + " " + capitalize(user?.status.split("_").join(" "))
          : user?.status === "ADD_BANK"
            ? "Didn't Add Bank"
            : user?.status === "CONFIRM_DEMAT"
              ? "Didn't Confirm Demat"
              : user?.status === "PLACE_ORDER"
                ? "Didn't Place Order"
                : capitalize(user?.status.split("_").join(" "))
        : "Completed",
      moment(user?.pan_updated_at || user?.updated_at || ""),
    ];
  });
};

export const AccountsByToTableRows = (
  accounts: GetAccountResponse[] | undefined
): any => {
  if (!accounts) return [];

  return accounts.map((account) => {
    return [
      account?.first_name || "",
      account?.last_name || "",
      moment(account?.created_at || ""),
    ];
  });
};

export const assetsToTableRows = (
  assets: AssetResponse[] | any,
  selectedFilters: string[] | [] = [],
  fields?: string[]
): string[][] => {
  if (!assets) return [];
  const response = assets?.map((asset: AssetResponse[] | any) => {
    let fieldsValue: string[] = [];

    if (fields && fields.length)
      if (selectedFilters.length > 0) {
        fields.forEach((keyName: string) => {
          const match = selectedFilters.find(
            (value) =>
              value.toLowerCase().replace(/\s+/g, "") === keyName.toLowerCase()
          );
          if (!match) {
            fieldsValue.push(asset[keyName] || "-");
          }
        });
      } else {
        fields.forEach((keyName: string) => {
          fieldsValue.push(asset[keyName] || "-");
        });
      }

    const row = fieldsValue.length
      ? fieldsValue
      : [asset.name, asset.symbol, asset.id];
    return row;
  });

  return response;
};

export const accountsToTableRows = (
  accounts: AccountResponse[] | NominatorAccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  const isAffiliate = getGlobalItem("isAffiliate");
  if (!accounts) return [];
  if (isAffiliate) {
    return (accounts || []).map((account) => [
      account.gui_account_id || "",
      account?.first_name + " " + account?.last_name,
      account.mobile || "",
      account.email || "",
      account.onboarding_tracker || "0",
      capitalize(account.status.split("_").join(" ")),
      moment(account.created_at),
    ]);
  } else {
    return (accounts || []).map((account) => [
      account.gui_account_id || "",
      capitalize(account?.first_name) + " " + capitalize(account?.last_name),
      account.mobile || "",
      account.email || "",
      account.wallet_balance || "0",
      account.withdraw_balance || "0",
      account.onboarding_tracker || "0",
      capitalize(account.status.split("_").join(" ")),
      moment(account.created_at),
    ]);
  }
};

export const accountsToTableRowsCSV = (
  accounts: AccountResponse[] | NominatorAccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  const isAffiliate = getGlobalItem("isAffiliate");
  if (!accounts) return [];
  return (accounts || []).map((account) => [
    account.gui_account_id || "",
    account?.first_name + " " + account?.last_name,
    account.mobile || "",
    account.email || "",
    account?.nominator?.id
      ? "Nominator"
      : account?.referral?.id
      ? "Referral"
      : "Access Code",
    account?.nominator?.name || "-",
    account?.nominator?.code || "-",
    account?.referral?.referred_by || "-",
    account?.referral?.code || "-",
    account?.wallet_balance || "0",
    account?.withdraw_balance || "0",
    account.onboarding_tracker || "0",
    capitalize(account.status.split("_").join(" ")),
    account?.pe_holdings?.length ? unquotedKeysString(account?.pe_holdings) : "",
    account?.pc_holdings?.length ? unquotedKeysString(account?.pc_holdings) : "",
    account?.total_pe_holdings_value || "0",
    account?.total_pc_holdings_value || "0",
    (new Date(account.created_at)).toLocaleDateString(),
  ]);
};

const unquotedKeysString = (data: any) => {
  return `[${data.map((obj: any) => 
    '{' + Object.entries(obj).map(([key, value]) => 
        `${key}: ${value === null ? 'null' : `'${value}'`}`
    ).join(', ') + '}'
  ).join(', ')}]`
}

export const holdingsToTableRows = (
  holdings: HoldingsResponse[] | undefined
): any => {
  if (!holdings) return [];
  return holdings?.map((holding: HoldingsResponse) => {
    return [
      holding.gui_account_id || "",
      capitalize(holding.first_name) + " " + capitalize(holding.last_name),
      holding.symbol,
      holding.price,
      holding.quantity,
      holding.mobile || "",
      capitalize(holding.sold.toString()),
      moment(holding.created_at),
    ];
  });
};

export const pcHoldingsToTableRows = (
  pcHoldings: PcHolding[] | undefined
): any => {
  if (!pcHoldings) return [];
  return pcHoldings?.map((holding: PcHolding) => {
    return [
      holding.gui_account_id || "",
      capitalize(holding.first_name) + " " + capitalize(holding.last_name),
      capitalize(holding.symbol),
      holding.price,
      holding.quantity,
      holding.returns,
      holding.subscription_amount,
      holding.min_repayment_amount,
      capitalize(holding?.status?.split("_").join(" ")),
      moment(holding.created_at),
    ];
  });
};

export const pcHoldingsByIdToTableRows = (
  pcHoldings: PCHoldingById[] | undefined
): any => {
  if (!pcHoldings) return [];
  return pcHoldings?.map((holding: PCHoldingById) => {
    return [
      holding.gui_id || "",
      capitalize(holding.symbol),
      holding.rate_of_returns,
      holding.tenure,
      holding.subscription_amount,
      holding.min_repayment_amount,
      capitalize(holding?.status?.split("_").join(" ")),
      moment(holding.tentative_end_date),
      moment(holding.created_at),
    ];
  });
};

export const accountsRegistrationToTableRows = (
  accounts: AccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  if (!accounts) return [];
  return (accounts || []).map((account) => [
    account.email || "",
    capitalize(account.status.split("_").join(" ")),
    account.registered ? "True" : "False",
    moment(account.created_at),
    moment(account.updated_at),
  ]);
};

export const accountsAcquisitionToTableRows = (
  accounts: AccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  if (!accounts) return [];
  return (accounts || []).map((account) => [
    account.email || "",
    capitalize(account.status.split("_").join(" ")),
    account.code || "",
    account.registered ? "True" : "False",
    moment(account.created_at),
    moment(account.updated_at),
  ]);
};

export const nominatorAccountsToTableRows = (
  accounts: NominatorAccountResponse[] | undefined
): (string | moment.Moment)[][] => {
  if (!accounts) return [];
  return (accounts || []).map((account) => [
    account.gui_account_id || "",
    account.first_name + " " + account.last_name,
    account.mobile || "",
    account.email || "",
    account.orders_count || "0",
    capitalize(account.status.split("_").join(" ")),
    moment(account.created_at),
  ]);
};

export const wishListToTableRows = (
  wishlists: WishlistResponse[] | undefined
): string[][] => {
  if (!wishlists) return [];
  return (wishlists || []).map((wishlist) => [
    wishlist.token || "",
    wishlist.name || "",
    wishlist.gui_account_id || "",
    wishlist.email || "",
    wishlist.mobile || "",
    wishlist.notified ? "True" : "False",
  ]);
};

export const pcWishListToTableRows = (
  wishlists: PCWishlistResponse[] | undefined
): string[][] => {
  if (!wishlists) return [];
  return (wishlists || []).map((wishlist) => [
    wishlist.name || "",
    wishlist.first_name + " " + wishlist.last_name || "",
    wishlist.gui_account_id || "",
    wishlist.email || "",
    wishlist.mobile || "",
    wishlist.notify ? "True" : "False",
  ]);
};

export const lamfDataToTableRows = (
  inquiries: LamfResponse[] | undefined
): (string | moment.Moment)[][] => {
  if (!inquiries) return [];
  return (inquiries || []).map((inquiry) => [
    inquiry?.gui_account_id || "",
    inquiry?.first_name + " " + inquiry?.last_name || "",
    inquiry?.email || "",
    inquiry?.mobile || "",
    inquiry?.aadhaar || "",
    inquiry?.pan || "",
    inquiry?.loan_amount || "",
    moment(inquiry?.created_at) || "",
  ]);
};

export const nominatorToTableRows = (
  nominators: NominatorResponse[] | undefined
): (string | moment.Moment)[][] => {
  if (!nominators) return [];
  return (nominators || []).map((nominator) => [
    nominator.name || "",
    process.env.PORTAL_URL + `register/${nominator.code}` || "",
    nominator.code || "",
    nominator.logo || "",
    nominator.accounts || "0",
    moment(nominator.created_at),
  ]);
};

export const txsToTableRows = (
  transfers: (Transfer | undefined)[] | undefined,
  includeAccountID = true
): (string | moment.Moment)[][] => {
  if (!transfers) return [];

  return transfers.map((t) => {
    const row = [
      t?.id || "",
      t?.direction || "",
      t?.type.toUpperCase() || "",
      numeral(t?.amount).format("$0,0.0"),
      t?.status || "",
      t?.updated_at || "",
    ];
    if (includeAccountID) row.unshift(t?.account_id || "");
    return row;
  });
};

export const docsToTableRows = (
  documents: (Document | undefined)[] | undefined,
  withActID = true
): string[][] => {
  if (!documents) return [];
  if (withActID)
    return documents.map((doc) => [
      doc?.id || "",
      doc?.account_id || "",
      doc?.type?.split("_").join(" ") || "",
      doc?.date || "",
    ]);
  return documents.map((doc) => [
    doc?.id || "",
    doc?.type?.split("_").join(" ") || "",
    doc?.date || "",
  ]);
};

export const journalsToTableRows = (
  journals: (Journal | undefined)[] | undefined,
  type = "JNLC"
): (string | moment.Moment)[][] => {
  if (!journals) return [];
  if (type === "JNLC")
    return journals.map((j) => [
      j?.id || "",
      j?.entry_type || "",
      j?.from_account || "",
      j?.to_account || "",
      numeral(j?.net_amount).format("$0,0.00"),
      j?.status || "",
      j?.settle_date || "",
    ]);

  return journals.map((j) => [
    j?.id || "",
    j?.entry_type || "",
    j?.symbol || "",
    numeral(j?.qty).format("0.00"),
    j?.from_account || "",
    j?.to_account || "",
    "",
    "",
  ]);
};

export const formatJSON = (j: any): string => {
  if (typeof j === "string") j = JSON.parse(j);
  return JSON.stringify(j, null, "\t");
};

export const firmAccountName = (accountNum: string): string => {
  if (accountNum.endsWith("SW")) {
    return "Sweep";
  } else if (accountNum.endsWith("ER")) {
    return "Error";
  } else if (accountNum.endsWith("DP")) {
    return "Deposit";
  } else if (accountNum.endsWith("RW")) {
    return "Rewards";
  } else if (accountNum.endsWith("CR")) {
    return "Credit";
  } else if (accountNum.endsWith("BR")) {
    return "Billing Receivables";
  } else if (accountNum.endsWith("CP")) {
    return "Commissions Payable";
  }
  return "Firm";
};

export const transactionsToTableRows = (
  transactions: TransactionDetailResponse[] | undefined
): (any | moment.Moment)[][] => {
  return (transactions || []).map((transaction, i) => [
    i + 1,
    transaction?.gui_transaction_id || "",
    transaction?.gui_account_id || "",
    capitalize(transaction?.direction || ""),
    getNumberInRupee(transaction?.amount || "", true),
    capitalize(transaction?.status?.split("_").join(" ")),
    moment(transaction?.created_at || ""),
  ]);
};

export const pennyDropTransactionsToTableRows = (
  transactions: PennyDropTransactionResponse[] | undefined
): (any | moment.Moment)[][] => {
  return (transactions || []).map((transaction, i) => [
    i + 1,
    transaction?.gui_account_id,
    transaction?.vendor_transaction_id || "",
    transaction?.payee_account_number || "",
    transaction?.payee_account_ifsc || "",
    capitalize(transaction?.status?.split("_").join(" ")),
    moment(transaction?.created_at || ""),
    moment(transaction?.updated_at || ""),
  ]);
};

export const walletTransactionsToTableRows = (
  transactions: Pe[] | undefined
): (any | moment.Moment)[][] => {
  return (transactions || []).map((transaction, i) => [
    i + 1,
    transaction?.gui_wallet_transaction_id || "",
    transaction?.wallet?.user?.gui_account_id || "",
    capitalize(transaction?.credit_debit || ""),
    getNumberInRupee(transaction?.transaction_amount || "", true),
    getNumberInRupee(transaction?.account_balance || "", true),
    capitalize(transaction?.status?.split("_").join(" ")),
    moment(transaction?.created_at || ""),
  ]);
};

export const peAssetsToTableRows = (
  assets: assetsPeResponse[] | undefined
): any => {
  if (!assets) return [];
  return assets.map((asset: assetsPeResponse) => {
    return [
      asset?.token || "",
      asset?.symbol || "",
      asset?.price || 0,
      asset?.totalWishlistUsers || 0,
      asset?.availableQuantity || 0,
      asset?.availableLots || 0,
      asset?.transferPendingOrderQuantity || 0,
      asset?.sourceQuantities || 0,
      asset?.comingSoon
        ? "Coming soon"
        : asset?.soldOut
        ? "Sold out"
        : asset?.onlyFewLeft
        ? "Only few left"
        : asset?.isListedOnExchange
        ? "Listed"
        : "Available",
    ];
  });
};
export const pcAssetsToTableRows = (assets: PcAsset[] | undefined): any => {
  if (!assets) return [];
  return assets.map((asset: PcAsset) => {
    return [
      asset?.gui_id || "",
      asset?.name || "",
      asset?.price || 0,
      moment(asset?.tentative_end_date || ""),
      asset?.subscribed_value || 0,
      asset?.tenure || 0,
      asset?.available_quantity || 0,
      asset.min_order_value || 0,
      asset?.active === true ? "True" : "False",
      asset?.status,
    ];
  });
};

export const cronDetailsToTableRows = (
  crons: CronRecord[] | undefined
): (any | moment.Moment)[][] => {
  return (crons || []).map((cron, i) => [
    i + 1,
    cron?.cron_name ?? "",
    cron?.start_time
      ? moment(cron?.start_time).format("DD-MM-YYYY HH:mm:ss")
      : "",
    cron?.end_time ? moment(cron?.end_time).format("DD-MM-YYYY HH:mm:ss") : "",
    cron?.status ?? "",
    cron?.reason ?? "",
  ]);
};

export const logsToTableRows = (
  crons: Log[] | undefined
): (any | moment.Moment)[][] => {
  return (crons || []).map((cron, i) => [
    i + 1,
    cron?.gui_account_id ?? "",
    cron?.full_name ?? "",
    cron?.email ?? "",
    cron?.type ?? "",
    cron?.url ?? "",
    // cron?.log ?? "",
    cron?.created_at
      ? moment(cron?.created_at).format("DD-MM-YYYY HH:mm:ss")
      : "",
  ]);
};