"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUBSCRIPTION_STATUS_MAP } from "@/utils/constants";
import { ReverseMapping } from "@/utils/helpers";
import { TSubscriptionStatus, TSupabasePlan } from "@/utils/types";
import React, { useEffect, useState } from "react";

type Props = {
  plans: TSupabasePlan[];
  setFilteredPlans: React.Dispatch<React.SetStateAction<TSupabasePlan[]>>;
};

type TSubscriptionStatusFilter = TSubscriptionStatus | "ALL";

const PlansFilter = ({ plans, setFilteredPlans }: Props) => {
  const [statusType, setStatusType] =
    useState<TSubscriptionStatusFilter>("ACTIVE");

  useEffect(() => {
    if (statusType === "ALL") {
      setFilteredPlans(plans);
    } else {
      setFilteredPlans(
        plans.filter(
          (item) =>
            ReverseMapping(SUBSCRIPTION_STATUS_MAP)[item.status] === statusType
        )
      );
    }
  }, [statusType, setFilteredPlans, plans]);

  return (
    <div className="flex flex-col gap-y-2">
      <Label htmlFor="planStatus">Filter by status</Label>
      <Select
        onValueChange={(value: TSubscriptionStatusFilter) =>
          setStatusType(value)
        }
        defaultValue={statusType}
        name="planStatus"
      >
        <SelectTrigger className="min-w-32">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectSeparator />
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CREATED">Idle</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default PlansFilter;
