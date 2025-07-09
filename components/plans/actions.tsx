import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
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
import React, { useCallback, useMemo } from "react";
import { toast } from "sonner";

type Props = {
  plan: IPlan;
};

const PlanActions = ({ plan }: Props) => {
  const isPlanActive = useMemo(() => plan.status === "ACTIVE", [plan]);

  // const handleActivation = useCallback(async () => {
  //   const response = await fetch(`/api/paypal/plans/${isPlanActive ? 'deactivate' : 'activate'}`);

  //   if (response.ok) {
  //     toast(response)
  //   }
  // }, [isPlanActive]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <CircleEllipsis className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel className="w-full flex gap-x-2 items-center ">
          <Activity /> Manage Plan
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isPlanActive ? (
          <DropdownMenuItem variant="destructive">
            <ShieldX /> Deactivate Plan
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem>
            <ShieldCheck /> Activate Plan
          </DropdownMenuItem>
        )}
        <DropdownMenuItem>
          <WalletCards />
          Update Plan
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-sm flex items-center text-popover-foreground gap-x-2">
            <CreditCard className="w-4 h-4" />
            Subscriptions
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem asChild>
              <Link href={`/admin/subscription/${plan.id}`}>
                <BookUser />
                View Subscriptions
              </Link>
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PlanActions;
