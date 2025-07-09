import { getSubscriptions } from "@/app/paypal.actions";
import CreatePlan from "@/components/create-plan";
import PlanCard from "@/components/plans/plan-card";
export default async function Page() {
  const subscriptions = await getSubscriptions();

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
        {/* <Button>New Plan</Button> */}
      </div>
      <div className="grid grid-cols-2 gap-4 pb-4">
        {subscriptions.plans.length > 0 ? (
          subscriptions.plans.map((sub) => <PlanCard key={sub.id} plan={sub} />)
        ) : (
          <p className="text-center w-full col-span-2">No Plans yet...</p>
        )}
        {/* {JSON.stringify(subscriptions)} */}
      </div>
    </div>
  );
}
