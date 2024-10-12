import {
  GetAllPCEnquiriesResponseData,
  PCEnquiryParams,
} from '../types/PcEnquiryType'
import axiosInstance from './axiosInstance'

export const getAllPcEnquiries = async (
  params: PCEnquiryParams
): Promise<GetAllPCEnquiriesResponseData> => {
  const response = await axiosInstance.get(`/dashboard/pc/enquiries`, {
    params,
  })
  return response.data.data
}
