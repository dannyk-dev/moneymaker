import { planActivator } from "@/app/paypal.actions";
import GenericError from "@/utils/error";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: { planId?: string } = await req.json();
    if (!body.planId) {
      throw new GenericError("Invalid Plan ID", 422);
    }

    await planActivator(body.planId, false);

    return NextResponse.json(
      {
        message: "Plan Deactivated",
      },
      {
        status: 202,
      }
    );
  } catch (err: any) {
    const error: GenericError = err;

    return NextResponse.json(
      {
        message: error.message,
      },
      {
        status: error?.statusCode,
      }
    );
  }
}
