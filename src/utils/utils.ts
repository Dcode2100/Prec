'use client'

import { OrderResponse } from "@/lib/types/types"
import moment from "moment"
import numeral from "numeral"

export const setGlobalItem = (key: string, value: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value)) // No need to use optional chaining with JSON
  }
}

export const capitalize = (value: string | undefined, split = true): string => {
  if (!value) return "";
  if (split) value = value.split("_").join(" ");
  return value
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getGlobalItem = (key: string) => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(key)

    if (storedValue) {
      try {
        return JSON.parse(storedValue) // Parse the stored JSON string properly
      } catch (error) {
        return null // Handle parsing errors gracefully
      }
    }
  }
  return null 
}

export const clearGlobalItem = () => {
  if (typeof window !== 'undefined') {
    localStorage.clear()
  }
}


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