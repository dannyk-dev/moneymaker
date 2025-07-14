import { INTERVAL_UNIT_MAP } from "./constants";

export function normalizeInterval(intervalCount: number, intervalUnit: number) {
  return `Every ${intervalCount} ${ReverseMapping(INTERVAL_UNIT_MAP)[
    intervalUnit
  ].toLowerCase()}${intervalCount > 1 ? "s" : ""}`;
}

export function normalizePrice(priceValue: string, intervalUnit: number) {
  return `$ ${priceValue} per ${ReverseMapping(INTERVAL_UNIT_MAP)[
    intervalUnit
  ].toLowerCase()}`;
}

export function extractMonthYearFromCardExpiry(expiry: string) {
  const [year, month] = expiry.split("-");

  return {
    year,
    month,
  };
}

export function convertMonthYearToCardExpiry(month: string, year: string) {
  return `${year}-${month}`;
}

export function ReverseMapping<
  T extends Record<string | number, string | number>,
  K extends keyof T,
  V extends T[K]
>(obj: T & Record<K, V>): { [P in V]: K extends string | number ? K : never } {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [value]: key,
    }),
    {}
  ) as { [P in V]: K extends string | number ? K : never };
}
