import GenericError from "@/utils/error";
import { getPayPalClient } from "@/utils/paypal/client";
import {
  IPlan,
  IProductRequest,
  IProductResponse,
  ISubscriptionFormRequest,
  ISubscriptionRequest,
  ISubscriptionResponse,
} from "@/utils/types";
import { revalidatePath } from "next/cache";

export async function getSubscriptions() {
  const client = await getPayPalClient();

  const response = await client.get("/v1/billing/plans");
  return response.data as ISubscriptionResponse;
}

export async function getPlanDetails(id: string): Promise<IPlan> {
  const client = await getPayPalClient();

  const response = await client.get(`/v1/billing/plans/${id}`);
  return response.data as IPlan;
}

export async function createSubscriptionPlan({
  name,
  status,
  billing_cycle,
}: ISubscriptionFormRequest) {
  const client = await getPayPalClient();

  const productPayload: IProductRequest = {
    name: "Example Product",
    type: "SERVICE",
    category: "SOFTWARE",
  };

  const { data: product, status: productStatus } =
    await client.post<IProductResponse>(
      "/v1/catalogs/products",
      productPayload
    );

  const subscriptionPayload: ISubscriptionRequest = {
    product_id: product.id,
    name,
    status,
    billing_cycles: [
      {
        ...billing_cycle,
        sequence: 1,
        tenure_type: "REGULAR",
      },
    ],
    payment_preferences: {
      payment_failure_threshold: 2,
      setup_fee: {
        currency_code: "USD",
        value: "10",
      },
      setup_fee_failure_action: "CONTINUE",
    },
  };

  if (productStatus == 201) {
    try {
      const response = await client.post<ISubscriptionResponse>(
        "/v1/billing/plans",
        subscriptionPayload
      );

      if (response.status === 201) {
        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  return false;
}

export async function planActivator(planId: string, activate: boolean = true) {
  try {
    const client = await getPayPalClient();
    const activationRoute = activate ? "activate" : "deactivate";

    const response = await client.post(
      `/v1/billing/plans/${planId}/${activationRoute}`
    );

    if (response.status === 204) {
      revalidatePath("admin/subscription");
      return true;
    }

    throw new GenericError("Failed to update subscription status", 500);
  } catch (error) {
    if (error instanceof GenericError) {
      throw error;
    }

    throw new GenericError();
  }
}
