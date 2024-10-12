import React, { useEffect, useMemo, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import AccountTable from "../accountTable/AccountTable";
import {
  getWalletTransactions,
  initializeWalletTransfer,
} from "@/lib/api/transactionsApi";
import {
  WalletTransactionListObj,
  TransactionsParams,
  TransactionStatus,
  InitializeWalletTransferParams,
  WalletTransactionDirection,
} from "@/lib/types/types";
import { useQuery } from "@tanstack/react-query";
import {
  FilterDrawer,
  FilterSelect,

  FilterDateSelect,
  FilterRadioButtons
} from "@/components/accountTable";
import { capitalize, getNumberInRupee } from "@/utils/utils";
import { CSVLink } from "react-csv";
import moment from "moment";
import WalletTransactionDetails from "@/components/sheets/WalletTransactionDetails";
import { Pe } from "@/lib/types/types";
import BankWithdrawExportSheet from "@/components/IDFC/BankWithdrawExportSheet";
import { toast } from "@/hooks/use-toast";
import { ColumnTable } from "@/lib/types";

const statusOptions = [
  "All",
  TransactionStatus.COMPLETED,
  TransactionStatus.PENDING,
  TransactionStatus.REJECTED,
  TransactionStatus.CANCELLED,
  TransactionStatus.REFUND_PENDING,
  TransactionStatus.REFUND_FAILED,
  TransactionStatus.REFUND_COMPLETED,
];

const dateFilter = [
  { value: "createdAt", label: "Created At", id: "0" },
  { value: "updatedAt", label: "Updated At", id: "1" },
];

const headers = [
  { label: "Transaction ID", key: "gui_wallet_transaction_id" },
  { label: "Account ID", key: "account_id" },
  { label: "Direction", key: "credit_debit" },
  { label: "UTR No", key: "reference_number" },
  { label: "Amount", key: "transaction_amount" },
  { label: "Transaction Fees", key: "charges_gst" },
  { label: "Order Value", key: "order_value" },
  { label: "Order Stamp Duty", key: "stamp_duty" },
  { label: "Order Transaction Fees", key: "transaction_fee" },
  { label: "Gst", key: "gst" },
  { label: "Documentation Charges", key: "documentation_charges" },
  { label: "Closing Balance", key: "account_balance" },
  { label: "User Transaction Type", key: "user_transaction_type" },
  { label: "Precize Transaction Type", key: "precize_transaction_type" },
  { label: "Status", key: "status" },
  { label: "Transaction Time", key: "transaction_time" },
  { label: "Created At", key: "created_at" },
  { label: "Updated At", key: "updated_at" },
  { label: "Vendor Transaction ID", key: "vendor_transaction_id" },
  { label: "Email", key: "wallet.user.email" },
  { label: "Mobile", key: "wallet.user.mobile" },
  { label: "Transaction Type", key: "transaction_type" },
  { label: "Gui Wallet Transaction Id", key: "gui_wallet_transaction_id" },
  { label: "Order Id", key: "order_id" },
  { label: "Provider Name", key: "provider_name" },
  { label: "Vendor Name", key: "vendor_name" },
  { label: "Vendor Wallet Id", key: "vendor_wallet_id" },
  { label: "Vendor status", key: "vendor_status" },
  { label: "Wallet Id", key: "wallet_id" },
  { label: "Wallet Transaction Id", key: "wallet_transaction_id" },
  { label: "Withdraw Amount", key: "withdraw_amount" },
  {
    label: "Vendor Wallet Transaction ID",
    key: "vendor_wallet_transaction_id",
  },
  {
    label: "Bank Account No",
    key: "wallet.user.bank_details[0].account_number",
  },
  {
    label: "Account IFSC",
    key: "wallet.user.bank_details[0].account_ifsc",
  },
  {
    label: "Bank Name",
    key: "wallet.user.bank_details[0].bank_name",
  },
  {
    label: "Branch Name",
    key: "wallet.user.bank_details[0].branch_name",
  },
];

function DebitWalletTransactions() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [directionFilter, setDirectionFilter] = useState<string>("DEBIT");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [amountFilter, setAmountFilter] = useState<any>([null, null]);
  const [selectedDates, setSelectedDates] = useState<any>([null, null]);
  const [filterKey, setFilterKey] = useState<any>(["debitWalletTransactions"]);
  const [applyFilter, setApplyFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedTransaction, setSelectedTransaction] = useState<
    string | undefined
  >(undefined);
  const [search, setSearch] = useState("");
  const [isLoadingAction, setIsLoadingAction] = useState({
    btnId: "",
    btnIdx: 0,
  });
  const [dateFilterType, setDateFilterType] = useState("createdAt");

  const [exportData, setExportData] = useState([]);
  const fetchDebitTransactions = async () => {
    const params: TransactionsParams = applyFilter
      ? {
          page,
          limit,
          direction: directionFilter,
          status: selectedTab === "processPending" ? "process_pending" : statusFilter,
        }
      : {
          direction: directionFilter,
          page,
          limit,
          status: selectedTab === "processPending" ? "process_pending" : statusFilter,
        };

    if (applyFilter) {
      //   setSearch(false);
      if (directionFilter && directionFilter !== "All") {
        params.direction = directionFilter;
      }
      // updated at date filter
      if (selectedDates[0] && selectedDates[1]) {
        params.dateFilterBy = dateFilterType;
        params[
          dateFilterType === "updatedAt" ? "updatedAfter" : "createdAfter"
        ] = selectedDates[0].utc().toISOString();
        params[
          dateFilterType === "updatedAt" ? "updatedBefore" : "createdBefore"
        ] = selectedDates[1].utc().toISOString();
      }

      // amount filters
      params.amountAbove = amountFilter[0] ?? undefined;
      params.amountBelow = amountFilter[1] ?? undefined;
    }
    // get transactions by account id
    setIsLoading(false);
    if (search) {
      setApplyFilter(false);
      params.search = search;
    }

    return !applyFilter && (await getWalletTransactions(params));
  };

  useEffect(() => {
    setPage(1);
    optimizedSearch();
  }, [search]);

  const debitTransactionsQuery = useQuery({
    queryKey: [
      filterKey,
      isLoading,
      applyFilter,
      page,
      limit,
      selectedTab,
      directionFilter,
    ],
    queryFn: fetchDebitTransactions,
  });

  const transactions = useMemo(
    () =>
      debitTransactionsQuery?.data?.PE || ([] as WalletTransactionListObj[]),
    [debitTransactionsQuery.data]
  );

  useEffect(() => {
    setExportData(
      transactions?.map((row: any) => {
        row.created_at = moment(row?.created_at).format("YYYY-MM-DD HH:mm:ss");
        row.updated_at = moment(row?.updated_at).format("YYYY-MM-DD HH:mm:ss");
        row.transaction_time
          ? (row.transaction_time = moment(row?.transaction_time).format(
              "YYYY-MM-DD HH:mm:ss"
            ))
          : "";
        return row;
      })
    );
  }, [transactions]);

  const getCommonHeaders = () => [
    "Sr. No",
    "Transaction ID",
    "Account ID",
    "Direction",
    "UTR No",
    "Amount",
    "Fees",
    "Settled Amt",
    "Closing Balance",
    "Transaction Type",
    "Status",
    "Created At",
  ];
  const tableHeaders =
    selectedTab !== "processPending"
      ? getCommonHeaders()
      : [...getCommonHeaders(), "Action"];

  const initializeWalletTransferfn = async (
    accountId: string,
    status: string,
    walletTransactionId: string
  ) => {
    const params: InitializeWalletTransferParams = {
      status,
      walletTransactionId,
    };
    try {
      const response = await initializeWalletTransfer(accountId, params);
      setIsLoading(true);
      toast({
        description: response?.message,
        variant: "success",
      });
    } catch (err) {
      setIsLoading(false);
    }
    setIsLoadingAction({ btnId: "", btnIdx: 0 });
  };
  const walletTransactionsToTableRows = (
    transactions: Pe[] | undefined
  ): (any | moment.Moment)[][] => {
    return (transactions || []).map((transaction, i) =>
      selectedTab === "processPending"
        ? [
            i + 1,
            transaction?.gui_wallet_transaction_id || "",
            transaction?.wallet?.user?.gui_account_id || "",
            capitalize(transaction?.credit_debit || ""),
            transaction?.reference_number || "-",
            getNumberInRupee(transaction?.transaction_amount || "", true),
            getNumberInRupee(transaction?.charges_gst || "", true),
            getNumberInRupee(transaction?.settled_amount || "", true),
            getNumberInRupee(transaction?.account_balance || "", true),
            transaction?.user_transaction_type || "",
            capitalize(transaction?.status?.split("_").join(" ")),
            moment(transaction?.created_at || ""),
            <Flex
              variant={"ghost"}
              style={{ gap: "10px" }}
              key={transaction.gui_wallet_transaction_id}
            >
              <Button
                colorScheme={"green"}
                title={"Approve"}
                isLoading={
                  isLoadingAction.btnId ===
                    transaction.gui_wallet_transaction_id &&
                  isLoadingAction.btnIdx === 1
                }
                isDisabled={
                  isLoadingAction.btnId ===
                    transaction.gui_wallet_transaction_id &&
                  isLoadingAction.btnIdx !== 0
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoadingAction({
                    btnId: transaction.gui_wallet_transaction_id,
                    btnIdx: 1,
                  });
                  initializeWalletTransferfn(
                    transaction?.account_id,
                    "APPROVE",
                    transaction?.wallet_transaction_id
                  );
                }}
              >
                &#10003;
              </Button>
              <Button
                colorScheme={"red"}
                title={"Decline"}
                isDisabled={
                  isLoadingAction.btnId ===
                    transaction.gui_wallet_transaction_id &&
                  isLoadingAction.btnIdx !== 0
                }
                isLoading={
                  isLoadingAction.btnId ===
                    transaction.gui_wallet_transaction_id &&
                  isLoadingAction.btnIdx === 2
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLoadingAction({
                    btnId: transaction.gui_wallet_transaction_id,
                    btnIdx: 2,
                  });
                  initializeWalletTransferfn(
                    transaction?.account_id,
                    "REJECT",
                    transaction?.wallet_transaction_id
                  );
                }}
              >
                &#x2717;
              </Button>
            </Flex>,
          ]
        : [
            i + 1,
            transaction?.gui_wallet_transaction_id || "",
            transaction?.wallet?.user?.gui_account_id || "",
            capitalize(transaction?.credit_debit || ""),
            transaction?.reference_number || "-",
            getNumberInRupee(transaction?.transaction_amount || "", true),
            getNumberInRupee(transaction?.charges_gst || "", true),
            getNumberInRupee(transaction?.settled_amount || "", true),
            getNumberInRupee(transaction?.account_balance || "", true),
            transaction?.user_transaction_type || "",
            capitalize(transaction?.status?.split("_").join(" ")),
            moment(transaction?.created_at || ""),
          ]
    );
  };

  useEffect(() => {
    if (selectedTab === "order") {
      setDirectionFilter(WalletTransactionDirection.ORDER);
    } else if (selectedTab === "withdrawals") {
      setDirectionFilter(WalletTransactionDirection.WITHDRAW);
    } else {
      setDirectionFilter(WalletTransactionDirection.DEBIT);
    }
    setPage(1);
  }, [selectedTab]);

  const debounce = (func: Function) => {
    let timer: number | null;
    return function () {
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        func();
      }, 500);
    };
  };
  const optimizedSearch = useMemo(
    () => debounce(debitTransactionsQuery.refetch),
    []
  );

  const columns = [
    { header: "Transaction ID", accessorKey: "gui_wallet_transaction_id", sortable: true },
    { header: "Account ID", accessorKey: "wallet.user.gui_account_id", sortable: true },
    { header: "Direction", accessorKey: "credit_debit", sortable: true },
    { header: "UTR No", accessorKey: "reference_number", sortable: true },
    { header: "Amount", accessorKey: "transaction_amount", sortable: true, 
      cell: (value: string) => getNumberInRupee(value, true) },
    { header: "Fees", accessorKey: "charges_gst", sortable: true,
      cell: (value: string) => getNumberInRupee(value, true) },
    { header: "Settled Amt", accessorKey: "settled_amount", sortable: true,
      cell: (value: string) => getNumberInRupee(value, true) },
    { header: "Closing Balance", accessorKey: "account_balance", sortable: true,
      cell: (value: string) => getNumberInRupee(value, true) },
    { header: "Transaction Type", accessorKey: "user_transaction_type", sortable: true },
    { header: "Status", accessorKey: "status", sortable: true },
    { header: "Created At", accessorKey: "created_at", sortable: true },
    ...(selectedTab === "processPending" ? [{
      header: "Action",
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              initializeWalletTransferfn(
                row.account_id,
                "APPROVE",
                row.wallet_transaction_id
              );
            }}
          >
            Approve
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              initializeWalletTransferfn(
                row.account_id,
                "REJECT",
                row.wallet_transaction_id
              );
            }}
          >
            Reject
          </Button>
        </div>
      ),
    }] : []),
  ];


  const removeFilter = (filterId: string) => {
    if (filterId === "amount") {
      setAmountFilter([null, null]);
    }
    if (filterId === "status") {
      setStatusFilter("All");
    }
    if (filterId === "dates") {
      setSelectedDates([null, null]);
      setDateFilterType("createdAt");
    }
    setApplyFilter(false);
  };

  const filterButton = (
    <div className="ml-2">

    </div>
  );
  const transactionDetails = selectedTransaction ? (
    <WalletTransactionDetails
      isOpen={!!selectedTransaction}
      onClose={() => setSelectedTransaction(undefined)}
      transaction_id={selectedTransaction}
    />
  ) : (
    ""
  );

  const [bankWithdrawExportData, setBankWithdrawExportData] = useState([]);
  //

  useEffect(() => {
    const determinePaymentMethod = (transaction: WalletTransactionListObj): string => {
      if (transaction.bene_account_ifsc?.includes("UTIB")) { // Axis Bank IFSC code
        return 'I'; 
      }

      const amount = parseFloat(transaction?.settled_amount);
      if (amount <= 200000) {
        return 'N';
      } else {
        return 'R';
      }
    };

    let exportData = transactions?.map((row: WalletTransactionListObj) => {
      const newRow = {
        "Payment Method Name": determinePaymentMethod(row),
        "Payment Amount (Request)": row?.settled_amount,
        "Activation Date": moment(new Date()).format("DD/MM/YYYY"),
        "Beneficiary Name (Request)":
          row?.wallet?.user?.first_name + " " + row?.wallet?.user?.last_name,
        "Account No": row?.bene_account_number,
        "Email Body": "",
        "Debit Account No": row?.debit_account_number,
        "CRN No": `PRE${row?.gui_wallet_transaction_id}`,
        "RECEIVER IFSC Code": row?.bene_account_ifsc,
        "RECEIVER Account Type": "11",
      };

      return newRow;
    });
    exportData = [
      {
        "Payment Method Name": "Text",
        "Payment Amount (Request)": "Amount",
        "Activation Date": "Date",
        "Beneficiary Name (Request)": "Text",
        "Account No": "Text",
        "Email Body": "Text",
        "Debit Account No": "Numeric",
        "CRN No": "Text",
        "RECEIVER IFSC Code": "AlphaNumeric",
        "RECEIVER Account Type": "Numeric",
      },
      ...exportData,
    ];
    setBankWithdrawExportData(exportData);
  }, [transactions]);

  return (
    <>
      {transactionDetails}
      <FilterDrawer
        isOpen={filterOpen}
        onClose={() => {
          setFilterOpen(false);
        }}
        onApply={() => {
          setApplyFilter(true);
          setFilterOpen(false);
        }}
      >
        <FilterSelect
          header="Status"
          options={statusOptions}
          onSelect={setStatusFilter}
          selected={statusFilter}
        />
        <FilterRadioButtons
          list={dateFilter}
          onSelect={(e) => {
            setDateFilterType(e);
          }}
          value={dateFilterType}
          setValue={setDateFilterType}
        />
        <FilterDateSelect
          header=""
          onDateSelect={(st, ed) => setSelectedDates([st, ed])}
        />
      </FilterDrawer>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="order">Order</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="processPending">Process Pending Withdrawals</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            {exportData && (
              <Button>
                <CSVLink
                  data={exportData}
                  filename={`TransactionData_${moment(new Date()).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}.csv`}
                  headers={headers}
                >
                  Export
                </CSVLink>
              </Button>
            )}
            {bankWithdrawExportData && selectedTab === "processPending" && (
              <BankWithdrawExportSheet data={bankWithdrawExportData} />
            )}
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-8"
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search Transaction"
              />
            </div>
            {filterButton}
          </div>
        </div>
        <AccountTable
          columns={columns}
          data={transactions}
          totalItems={debitTransactionsQuery.data?.total || 0}
          itemsPerPage={limit}
          currentPage={page}
          onPageChange={(newPage, newLimit) => {
            setPage(newPage);
            if (newLimit) setLimit(newLimit);
          }}
          onSearch={(value) => setSearch(value)}
          isSearchable={true}
          isLoading={debitTransactionsQuery.isFetching}
          onRowClick={(row) => setSelectedTransaction(row.wallet_transaction_id)}
        />
      </Tabs>
    </>
  );
}

export default DebitWalletTransactions;