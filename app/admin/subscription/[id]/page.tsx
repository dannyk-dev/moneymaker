import { getPlanDetails } from "@/app/paypal.actions";
import BackButton from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { INTERVAL_UNIT_MAP } from "@/utils/constants";
import { normalizePrice } from "@/utils/helpers";
import { TIntervalUnit } from "@/utils/types";
import React from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const SubscriptionListPage = async ({ params }: Props) => {
  const { id } = await params;
  const currentPage = await getPlanDetails(id);

  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col gap-y-4">
        <BackButton />
        <div className="w-full flex flex-col gap-y-10">
          <div className="space-y-3 mt-4">
            <h3 className="capitalize text-2xl">{currentPage.name}</h3>
            <div className="flex items-center gap-x-2">
              <Badge variant="default">Recurring Payments</Badge>
              <Badge variant="success">
                {normalizePrice(
                  currentPage.billing_cycles[0].pricing_scheme.fixed_price
                    .value,
                  INTERVAL_UNIT_MAP[
                    currentPage.billing_cycles[0].frequency
                      .interval_unit as TIntervalUnit
                  ]
                )}
              </Badge>
            </div>
          </div>
          <p className="">No Active Subscriptions here...</p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionListPage;
