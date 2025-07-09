import { createSubscriptionPlan } from "@/app/paypal.actions";
import { ISubscriptionFormRequest } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
    const payload: ISubscriptionFormRequest = await req.json();

    try {
        const result = await createSubscriptionPlan(payload);

        if (result) {
            return NextResponse.json({
                message: "Created successfullyl"
            }, {
                status: 201
            });
        }

        return NextResponse.json({
            message: "Bad request"
        }, {
            status: 400
        })
        
    } catch (error) {
        console.error(error.response);
        return NextResponse.json({
            message: "Internal Server error"
        }, {
            status: 500
        })
    }
}


