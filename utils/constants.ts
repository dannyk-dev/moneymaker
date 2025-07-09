import { badgeVariants, TBadgeVariants } from "@/components/ui/badge";
import { TSubscriptionStatus } from "./types";

const SubscriptionStatusLabels: Record<TSubscriptionStatus, {
    variant: TBadgeVariants;
    label: string;
}> = {
    ACTIVE: {
        variant: 'success',
        label: "Active"
    },
    CREATED: {
        variant: 'default',
        label: "Idle"
    },
    INACTIVE: {
        variant: 'destructive',
        label: "Inactive"
    }
}

export function getPlanStatusLabel(status: TSubscriptionStatus) {
    return SubscriptionStatusLabels[status];
}