import { TBadgeVariants } from "@/components/ui/badge";
import {
  TCardType,
  TIntervalUnit,
  TSubscriptionStatus,
  TTenureType,
} from "./types";
import { ReverseMapping } from "./helpers";

const SubscriptionStatusLabels: Record<
  TSubscriptionStatus,
  {
    variant: TBadgeVariants;
    label: string;
  }
> = {
  ACTIVE: {
    variant: "success",
    label: "Active",
  },
  CREATED: {
    variant: "default",
    label: "Idle",
  },
  INACTIVE: {
    variant: "destructive",
    label: "Inactive",
  },
};

export function getPlanStatusLabel(status: number) {
  const subStatus = ReverseMapping(SUBSCRIPTION_STATUS_MAP)[status];
  return SubscriptionStatusLabels[subStatus];
}

export const CARD_TYPE_MAP: Record<TCardType, number> = {
  CREDIT: 1,
  DEBIT: 2,
  PREPAID: 3,
};

export const INTERVAL_UNIT_MAP: Record<TIntervalUnit, number> = {
  DAY: 1,
  WEEK: 2,
  MONTH: 3,
  YEAR: 4,
};

export const TENURE_TYPE_MAP: Record<TTenureType, number> = {
  REGULAR: 1,
  TRIAL: 2,
};

export const SUBSCRIPTION_STATUS_MAP: Record<TSubscriptionStatus, number> = {
  ACTIVE: 1,
  CREATED: 2,
  INACTIVE: 3,
};
