import { upsertPaypalPlan } from "@/app/actions";
import { verifyPayPalWebhookSignature } from "@/app/paypal.actions";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const rawBody = await req.text(); // 👈 Required for signature verification
  const headers = req.headers;

  const verificationResult = await verifyPayPalWebhookSignature(
    headers,
    rawBody
  );

  if (verificationResult !== "SUCCESS") {
    console.warn("❌ Webhook signature verification failed");
    return new Response("Invalid webhook signature", { status: 400 });
  }

  const body = JSON.parse(rawBody);
  const eventType = body.event_type;
  const resource = body.resource;

  try {
    switch (eventType) {
      case "BILLING.PLAN.CREATED":
      case "BILLING.PLAN.UPDATED":
      case "BILLING.PLAN.ACTIVATED":
      case "BILLING.PLAN.DEACTIVATED":
        await upsertPaypalPlan(resource);
        break;
      default:
        console.log(`ℹ️ Unhandled event type: ${eventType}`);
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("❌ Error handling webhook:", error);
    return new Response("Webhook error", { status: 500 });
  }
}
