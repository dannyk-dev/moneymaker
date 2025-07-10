"use client";

import PlanCard from "@/components/plans/plan-card";
import PlansFilter from "@/components/plans/plans-filter";
import { ISubscriptionResponse } from "@/utils/types";
import React, { useState } from "react";

type Props = {
  plans: ISubscriptionResponse;
};

const PlanList = ({ plans }: Props) => {
  const [filteredPlans, setFilteredPlans] = useState(plans.plans);

  return (
    <div className="space-y-4">
      <div className="w-full flex items-center gap-x-4">
        <PlansFilter plans={plans.plans} setFilteredPlans={setFilteredPlans} />
      </div>
      <div className="grid grid-cols-2 gap-4 pb-4">
        {filteredPlans.length > 0 ? (
          filteredPlans.map((sub) => <PlanCard key={sub.id} plan={sub} />)
        ) : (
          <p className="text-center w-full col-span-2">No Plans found...</p>
        )}
      </div>
    </div>
  );
};

export default PlanList;
