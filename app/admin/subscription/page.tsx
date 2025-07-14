import { getPayPalPlans } from "@/app/actions";
import Container from "@/components/container";
import CreatePlan from "@/components/create-plan";
import PlanList from "@/components/plans/plan-list";

export default async function Page() {
  const plans = await getPayPalPlans();

  return (
    <Container
      title="Subscriptions"
      description="Manage your subscription plans"
      RightComponents={<CreatePlan />}
    >
      <PlanList plans={plans} />
    </Container>
  );
}
