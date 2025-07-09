import React from "react";
import { IPlan } from "../../utils/types";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPlanStatusLabel } from "@/utils/constants";
import { Badge } from "@/components/ui/badge";
import PlanActions from "@/components/plans/actions";

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
      <div className="grid gap-2 mt-2 text-sm">
        <div className="grid grid-cols-[150px_1fr]"></div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="text-muted-foreground">Price</div>
          <div>
            $ {plan.billing_cycles[0].pricing_scheme.fixed_price.value} per{" "}
            {plan.billing_cycles[0].frequency.interval_unit.toLowerCase()}
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="text-muted-foreground">Cycle</div>
          <div>
            Every {plan.billing_cycles[0].frequency.interval_count}{" "}
            {plan.billing_cycles[0].frequency.interval_unit.toLowerCase()}{" "}
            {plan.billing_cycles[0].frequency.interval_count > 1 ? "s" : ""}
          </div>
        </div>
        <div className="grid grid-cols-[150px_1fr]">
          <div className="text-muted-foreground">Status</div>
          <div className="flex items-center gap-2">
            <Badge variant={getPlanStatusLabel(plan.status).variant}>
              {getPlanStatusLabel(plan.status).label}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PlanCard;
