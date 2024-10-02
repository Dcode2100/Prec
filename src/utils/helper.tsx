import crypto from "crypto";
import moment from 'moment-timezone'

const algorithm = 'aes-256-cbc'
const key = '2b7e151628aed2a6abf7158809cf4f3c'
const iv = '3ad77bb40d7a3660'
const inputEncoding = 'utf8'
const outputEncoding = 'base64'
const timezone = 'Asia/Kolkata'

export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  let encrypted = cipher.update(text, inputEncoding, outputEncoding)
  encrypted += cipher.final(outputEncoding)
  return encrypted
}

// Convert string to Date object
export const convertDateToUTC = (date: string) => {
  const ist = moment.tz(`${date} 00:00:00`, timezone)
  return ist.clone().tz('UTC').format()
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