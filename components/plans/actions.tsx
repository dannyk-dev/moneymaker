"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IPlan } from "@/utils/types";
import {
  Activity,
  BookUser,
  CircleEllipsis,
  CreditCard,
  ShieldCheck,
  ShieldX,
  WalletCards,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "../ui/spinner";

type Props = {
  plan: IPlan;
};

const PlanActions = ({ plan }: Props) => {
  const isPlanActive = useMemo(() => plan.status === "ACTIVE", [plan]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleActivation = useCallback(
    async (activeState: boolean) => {
      setIsLoading(true);

      try {
        const response = await fetch(
          `/api/paypal/plans/${activeState ? "deactivate" : "activate"}`,
          {
            body: JSON.stringify({
              planId: plan.id,
            }),
            method: "POST",
          }
        );

        if (response.ok) {
          const data = await response.json();

          toast(data.message);
          router.refresh();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [plan.id, router]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {isLoading ? <Spinner /> : <CircleEllipsis className="w-5 h-5" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="w-full flex gap-x-2 items-center ">
            <Activity className="w-4 h-4" /> Manage Plan
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isPlanActive ? (
            <DropdownMenuItem
              variant="destructive"
              onClick={() => handleActivation(isPlanActive)}
            >
              <ShieldX /> Deactivate Plan
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => handleActivation(isPlanActive)}>
              <ShieldCheck /> Activate Plan
            </DropdownMenuItem>
          )}
          <DropdownMenuItem>
            <WalletCards />
            Update Plan
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={`/admin/subscription/${plan.id}`}>
              <BookUser />
              View Subscriptions
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCard className="w-4 h-4" />
            New Card
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlanActions;
