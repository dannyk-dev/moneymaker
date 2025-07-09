"use server";

import { getPayPalClient } from "@/utils/paypal/client";
import {
  IProductRequest,
  IProductResponse,
  ISubscriptionFormRequest,
  ISubscriptionRequest,
  ISubscriptionResponse,
} from "@/utils/types";

export async function getSubscriptions() {
  const client = await getPayPalClient();

  const response = await client.get("/v1/billing/plans");
  return response.data;
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

  const { data: product } = await client.post<IProductResponse>(
    "/v1/catalog/products",
    productPayload
  );

  const subscriptionPayload: ISubscriptionRequest = {
    product_id: product.id,
    name,
    status,
    billing_cycle: {
      ...billing_cycle,
      sequence: 1,
      tenure_type: "REGULAR",
      payment_preferences: {
        payment_failure_threshold: 2,
        setup_fee: {
          currency_code: "USD",
          value: "10",
        },
        setup_fee_failure_action: "CONTINUE",
      },
    },
  };

  const response = await client.post<ISubscriptionResponse>(
    "/v1/billing/plans",
    [subscriptionPayload]
  );

  if (response.status === 201) {
    console.log(response.data);
    return true;
  }

  return false;
}
