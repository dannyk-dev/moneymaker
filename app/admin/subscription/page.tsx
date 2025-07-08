import { Card } from "@/components/ui/card";
import { cn } from "@/utils/styles";

export default async function Page() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-2xl font-medium">Subscriptions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscription plans
          </p>
        </div>
      </div>
      <div className="space-y-6">
      <Card key={0}>
            <h2 className="font-medium">Subscription 1</h2>
            <div className="grid gap-2 mt-2 text-sm">
              <div className="grid grid-cols-[150px_1fr]">
                <div className="text-muted-foreground">Plan description</div>
                <div>This is an example subscription with a price of $100 per month</div>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <div className="text-muted-foreground">Price</div>
                <div>
                  $100 per month
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr]">
                <div className="text-muted-foreground">Status</div>
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full bg-red-500"
                    )}
                  ></div>
                  Inactive
                </div>
              </div>
              {/* <SubscriptionActions subscription={subscription} /> */}
            </div>
          </Card>
      </div>
      {/* <div>
        <h3 className="text-lg font-medium">Raw Data</h3>
        <div className="mt-2 border p-4 rounded-lg">
          <pre>{JSON.stringify(data.subscriptions, null, 2)}</pre>
        </div>
      </div> */}
    </div>
  );
}
