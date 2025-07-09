import { getSubscriptions } from "@/app/paypal.actions";
import CreatePlan from "@/components/create-plan";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getPlanStatusLabel } from "@/utils/constants";

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
      <div className="grid grid-cols-2 gap-4">
        {subscriptions.plans.length > 0 ? subscriptions.plans.map((sub) => (
          <Card key={sub.id}>
          <h2 className="font-medium">{sub.name}</h2>
          <div className="grid gap-2 mt-2 text-sm">
            <div className="grid grid-cols-[150px_1fr]">
              {sub?.description && (
                <>
                  <div className="text-muted-foreground">Plan description</div>
                <div>
                  {sub.description}
                </div>
                </>
              )}
            </div>
            <div className="grid grid-cols-[150px_1fr]">
              <div className="text-muted-foreground">Price</div>
              <div>
                $ {sub.billing_cycles[0].pricing_scheme.fixed_price.value} per {sub.billing_cycles[0].frequency.interval_unit.toLowerCase()}
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr]">
              <div className="text-muted-foreground">Cycle</div>
              <div>
                Every {sub.billing_cycles[0].frequency.interval_count} {sub.billing_cycles[0].frequency.interval_unit.toLowerCase()} {sub.billing_cycles[0].frequency.interval_count > 1 ? 's' : ''}
              </div>
            </div>
            <div className="grid grid-cols-[150px_1fr]">
              <div className="text-muted-foreground">Status</div>
              <div className="flex items-center gap-2">
                <Badge variant={getPlanStatusLabel(sub.status).variant}>
                  {getPlanStatusLabel(sub.status).label}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        )) : (
          <p>No Plans yet...</p>
        )}
        {/* {JSON.stringify(subscriptions)} */}
      </div>
    </div>
  );
}
