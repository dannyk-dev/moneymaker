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
  return response.data as ISubscriptionResponse;
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
