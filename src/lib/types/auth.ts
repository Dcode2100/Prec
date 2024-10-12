// Generic API response type
export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  id: string;
  auth_type?: "MFA" | "OTP";
  account_id: string;
}

type EnumDictionary<T extends string | number, U> = {
  [K in T]: U;
};

export type Generic = { [key: string]: any };

/*
 * TYPES
 */

export enum Role {
  Superuser = "superuser",
  Developer = "developer",
  Operations = "operations",
}

export const RoleNames: EnumDictionary<string, string> = {
  [Role.Superuser]: "Super User",
  [Role.Developer]: "Developer (Admin)",
  [Role.Operations]: "Operations",
};

export type MFAStatus = "ENABLED" | "VERIFY_PHONE" | "PHONE_REQUIRED";

/*
 * REQUEST RESPONSES
 */

export interface GenericResponseWithMessageData {}

export interface GenericResponseWithMessage {
  statusCode: number;
  message: string;
  data: GenericResponseWithMessageData;
}
