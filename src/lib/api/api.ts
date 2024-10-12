import axiosInstance from './axiosInstance'
import { ApplyRightIssueParams, ApplyRightIssueResponse } from '../types/types'

export const ApplyRightIssue = async (
  params: ApplyRightIssueParams,
  holding_id: string
) => {
  const response = await axiosInstance.post<ApplyRightIssueResponse>(
    `dashboard/holdings/${holding_id}/rights-issue`,
    {
      ...params,
    }
  )
  return response
}
