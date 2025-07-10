import { getSubscriptions } from "@/app/paypal.actions";
import CreatePlan from "@/components/create-plan";
import PlanList from "@/components/plans/plan-list";

export default async function Page() {
  const plans = await getSubscriptions();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription plans
          </p>
        </div>
        <CreatePlan />
      </div>
      <PlanList plans={plans} />
    </div>
  );
}
