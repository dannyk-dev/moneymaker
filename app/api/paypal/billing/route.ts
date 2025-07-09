import { getSubscriptions } from "@/app/paypal.actions";
import { NextRequest, NextResponse } from "next/server";

// export async function POST(req: NextRequest) {
//   const { planId } = await req.json();
//   const sub = await createSubscription(planId);
//   return NextResponse.json(sub);
// }

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const sub = await getSubscriptions();

  //   if (sub.status === "ACTIVE") {
  // await logTransaction({
  //   paypal_id: sub.id,
  //   type: "subscription",
  //   amount: Number(sub.billing_info?.last_payment?.amount?.value ?? 0),
  //   currency: sub.billing_info?.last_payment?.amount?.currency_code ?? "USD",
  //   status: sub.status,
  //   customer_email: sub.subscriber?.email_address,
  // });
  //   }

  return new Response(JSON.stringify(sub), {
    headers: { "Content-Type": "application/json" },
  });
}
