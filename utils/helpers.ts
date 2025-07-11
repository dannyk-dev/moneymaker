import { TIntervalUnit } from "@/utils/types";

export function normalizeInterval(
  intervalCount: number,
  intervalUnit: TIntervalUnit
) {
  return `Every ${intervalCount} ${intervalUnit.toLowerCase()}${
    intervalCount > 1 ? "s" : ""
  }`;
}

export function normalizePrice(
  priceValue: string,
  intervalUnit: TIntervalUnit
) {
  return `$ ${priceValue} per ${intervalUnit.toLowerCase()}`;
}

export function extractMonthYearFromCardExpiry(expiry: string) {
  const [year, month] = expiry.split('-')


  return {
    year,
    month
  }
}

export function convertMonthYearToCardExpiry(month: string, year: string) {
  return `${year}-${month}`
}
