import React from "react";
import { IPlan } from "../../utils/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPlanStatusLabel } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import PlanActions from "@/components/plans/actions";
import { normalizeInterval, normalizePrice } from "@/utils/helpers";

type Props = {
  plan: IPlan;
};

const PlanCard = ({ plan }: Props) => {
  return (
    <Card>
      <div className="flex w-full items-start justify-between">
        <div>
          <CardHeader className="p-0">
            <CardTitle>{plan.name}</CardTitle>
            {plan?.description && (
              <>
                <CardDescription>{plan.description}</CardDescription>
              </>
            )}
          </CardHeader>
        </div>
        <PlanActions plan={plan} />
      </div>
      <CardContent className="grid gap-2 mt-2 text-sm px-0">
        <div className="grid grid-cols-[150px_1fr]"></div>
        <div className="grid grid-cols-[150px_1fr] ">
          <div className="text-muted-foreground">Price</div>
          <div className="ml-auto">
            {normalizePrice(
              plan.billing_cycles[0].pricing_scheme.fixed_price.value,
              plan.billing_cycles[0].frequency.interval_unit
            )}
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="text-muted-foreground">Cycle</div>
          <div className="ml-auto">
            {normalizeInterval(
              plan.billing_cycles[0].frequency.interval_count,
              plan.billing_cycles[0].frequency.interval_unit
            )}
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="text-muted-foreground">Status</div>
          <div className="flex items-center gap-2 ml-auto">
            <Badge variant={getPlanStatusLabel(plan.status).variant}>
              {getPlanStatusLabel(plan.status).label}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanCard;
