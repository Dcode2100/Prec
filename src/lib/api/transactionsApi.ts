import { getGlobalItem } from "@/utils/utils";
import { GenericResponse } from "../types";
import { GetAccountWalletTransactionsbyIdResponse, getTransactionByIdResponse, InitializeWalletTransferParams, TransactionsParams, WalletTransactionsParams } from "../types/types";
import { setInstance } from "./axiosInstance";
import axiosInstance from "./axiosInstance";
import { Data, Pe, WalletTransactionsResponse } from "../types/walletType";
import { BulkPeTransactionsResponse } from "../types/bulkPeType";

export const getCoinTransactionsById = async (
    accountId: string,
    type: string,
    params: any
  ) => {
    const res = await axiosInstance.get<GenericResponse<any>>(
      `/dashboard/coins/PE/accounts/${accountId}`,
      {
        params,
      }
    );
    return res?.data?.data;
  };
  
  export const getPennyDropTransactionsByAccountId = async (
    accountId: string,
    params: TransactionsParams,
    type: string
  ): Promise<any> => {
    const isAffiliate = getGlobalItem("isAffiliate");
  
    const response = isAffiliate
      ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/validateBank/PE/account/${accountId}`,
        {
          params,
        }
      )
      : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/validateBank/PE/account/${accountId}`,
        {
          params,
        }
      );
    const peTransactions = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: "PE",
      };
    });
  
    const transactions = [...peTransactions];
  
    return { transactions, total: response?.data?.data?.total };
  };
  
  export const getAccountWalletTransactions = async (
    accountId: string,
    type: string,
    params: WalletTransactionsParams
  ) => {
    const isAffiliate = getGlobalItem("isAffiliate");
    const res = isAffiliate
      ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/accounts/${accountId}/walletTransactions`,
        {
          params,
        }
      )
      : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/accounts/${accountId}/walletTransactions`,
        {
          params,
        }
      );
    return res.data?.data;
  };


  export const getTransactionsByAccountId = async (
    accountId: string,
    params: TransactionsParams,
    type: string
  ): Promise<any> => {
    const isAffiliate = getGlobalItem("isAffiliate");
  
    const response = isAffiliate
      ? await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/nominatorDashboard/transactions/${type}/account/${accountId}`,
        {
          params,
        }
      )
      : await axiosInstance.get<GenericResponse<any>>(
        `/dashboard/transactions/${type}/account/${accountId}`,
        {
          params,
        }
      );
  
    const peTransactions = response.data.data.PE.map((order: any) => {
      return {
        ...order,
        type: "PE",
      };
    });
  
    const transactions = [...peTransactions];
  
    return { transactions, total: response?.data?.data?.total };
  };
  
  export const getWalletTransactions = async (
    params: TransactionsParams
  ): Promise<Data | undefined> => {
    const response = await axiosInstance.get<WalletTransactionsResponse>(
      `/dashboard/wallets/transactions`,
      {
        params,
      }
    );
    const peTransactions = response?.data?.data?.PE.map((transaction) => {
      return {
        ...transaction,
        type: "PE",
      };
    });
    const transactions: Pe[] = [...peTransactions].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
    return {
      PE: transactions,
      total: response?.data?.data?.total,
      credit_amount: response?.data?.data?.credit_amount,
      debit_amount: response?.data?.data?.debit_amount,
      order_amount: response?.data?.data?.order_amount,
      withdraw_amount: response?.data?.data?.withdraw_amount,
      wallet_balance: response?.data?.data?.wallet_balance,
    };
  };
  
  export const getAllCoinTransactions = async (
    params: TransactionsParams
  ): Promise<Data | undefined> => {
    const response = await axiosInstance.get<WalletTransactionsResponse>(
      `/dashboard/coins`,
      {
        params,
      }
    );
    const peTransactions = response?.data?.data?.PE.map((transaction) => {
      return {
        ...transaction,
        type: "PE",
      };
    });
    const transactions: Pe[] = [...peTransactions].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
    return {
      PE: transactions,
      total: response?.data?.data?.total,
      credit_amount: "",
      debit_amount: "",
      order_amount: "",
      withdraw_amount: "",
      wallet_balance: "",
    };
  };
  export const getBulkPeTransactions = async (
    params: TransactionsParams
  ): Promise<any> => {
    const response = await axiosInstance.get<
      GenericResponse<BulkPeTransactionsResponse>
    >(`/dashboard/bulkpe/transactions`, {
      params,
    });
    return response.data.data;
  };
  
  export const getWalletTransactionsById = async (
    transaction_id: string
  ): Promise<any> => {
    const response = await axiosInstance.get<
      GenericResponse<getTransactionByIdResponse>
    >(`/dashboard/wallets/transactions/PE/${transaction_id}`);
    return response.data.data;
  };
  
  export const getAccountWalletTransactionsById = async (
    transaction_id: string
  ): Promise<any> => {
    const response = await axiosInstance.get<
      GenericResponse<GetAccountWalletTransactionsbyIdResponse>
    >(`/dashboard/wallets/transactions/PE/${transaction_id}`);
    return response.data.data;
  };
  
  export const getWalletTransactionsByAccountId = async (
    accountId: string,
    params: TransactionsParams
  ): Promise<any> => {
    const response = await axiosInstance.get<
      GenericResponse<WalletTransactionsResponse>
    >(`/dashboard/accounts/${accountId}/walletTransactions`, {
      params,
    });
    return response.data.data;
  };
  
  export const getAllProcessPendingWalletTransactions = async () => {
    const response = await axiosInstance.get<WalletTransactionsResponse>(
      `/dashboard/wallets/transactions?status=process_pending`
    );
    const peTransactions = response?.data?.data?.PE.map((transaction) => {
      return {
        ...transaction,
        type: "PE",
      };
    });
    const transactions: Pe[] = [...peTransactions].sort((a, b) =>
      b.created_at.localeCompare(a.created_at)
    );
    return {
      PE: transactions,
      total: response?.data?.data?.total,
      credit_amount: response?.data?.data?.credit_amount,
      debit_amount: response?.data?.data?.debit_amount,
      order_amount: response?.data?.data?.order_amount,
      withdraw_amount: response?.data?.data?.withdraw_amount,
      wallet_balance: response?.data?.data?.wallet_balance,
    };
  };
  

  export const updateTransactionStatusById = async (
    type: string,
    transactionId: string,
    status: string
  ) => {
    const body = {
      status: status,
    };
    const response = await axiosInstance.put<GenericResponse<any>>(
      `/dashboard/transactions/updateStatus/${type}/${transactionId}`,
      body
    );
  
    return response.data?.data;
  };

  export const approvePendingTransactions = async (
    status: string,
    walletTransactionId: string
  ): Promise<any> => {
    const response: any = await axiosInstance.put(
      `/dashboard/wallets/transactions/${walletTransactionId}/upi-deposit`,
      { status }
    );
    return response?.data;
  };


  export const UploadBulkCreditWalletTransactions = async (formData: any): Promise<any> => {
    setInstance(axiosInstance);
    const response: any = await axiosInstance.post(
      `dashboard/wallets/bulk-deposit`,
      formData
    );
    return response?.data;
  };

  export const initializeWalletTransfer = async (
    accountId: string,
    params: InitializeWalletTransferParams
  ): Promise<any> => {
    const response = await axiosInstance.put(`/dashboard/wallets/${accountId}`, {
      ...params,
    });
    return response.data;
  };

  
  export const createWallet = async (accountId: any): Promise<any> => {
    setInstance(axiosInstance);
    try {
      const walletResponse: any = await axiosInstance.post(
        `/dashboard/wallets/${accountId}`
      );
      return walletResponse?.data;
    } catch (err) {
      return err;
    }
  };

  export const getAccount = async (type: string, accountId: string) => {
    if (accountId.length === 0 || type.length === 0) return;
    setInstance(axiosInstance);
    const isAffiliate = getGlobalItem("isAffiliate");
    const res = isAffiliate
      ? await axiosInstance.get(
        `/dashboard/nominatorDashboard/accounts/${type}/${accountId}`
      )
      : await axiosInstance.get(`/dashboard/accounts/${type}/${accountId}`);
  
    return res.data?.data;
  };