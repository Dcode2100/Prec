import axiosInstance from "@/lib/api/axiosInstance";
import { GenericResponse } from "@/lib/types";
import { AddFundsParams, ApproveDepositParams, PeFundsDataInterface } from "@/lib/types/types";
import { getGlobalItem } from "@/utils/utils";

export const getAccountFunds = async (accountId: string) => {
  const isAffiliate = getGlobalItem("isAffiliate");
  const res = isAffiliate
      ? await axiosInstance.get<GenericResponse<PeFundsDataInterface>>(
        `/dashboard/nominatorDashboard/accounts/${accountId}/funds`
      )
      : await axiosInstance.get<GenericResponse<PeFundsDataInterface>>(
        `/dashboard/accounts/${accountId}/funds`
      );
  
    return res.data?.data;
};
  

export const addFunds = async (
    params: AddFundsParams,
    accountId: string
  ): Promise<any> => {
    const response: any = await axiosInstance.post(
      `/dashboard/wallets/account/${accountId}/deposit`,
      { ...params }
    );
    return response?.data;
};
  

export const withdrawFunds = async (
    amount: number,
    accountId: string
  ): Promise<any> => {
    try {
      const response: any = await axiosInstance.post(
        `/dashboard/wallets/transactions/${accountId}/withdraw`,
        { amount }
      );
      return response?.data;
    } catch (err) {
      return err;
    }
};
  
export const createAWithdrawTransaction = async (id: string, payload: any) => {
  const response = await axiosInstance.post<GenericResponse<any>>(
    `/dashboard/wallets/transactions/${id}/withdraw`,
    payload
  );
  return response;
};

export const approveDeposits = async (
  params: ApproveDepositParams,
  walletTransactionId: string
): Promise<any> => {
  const response: any = await axiosInstance.put(
    `/dashboard/wallets/transactions/${walletTransactionId}/deposit`,
    { ...params }
  );
  return response?.data;
};
