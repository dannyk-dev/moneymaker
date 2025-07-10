import { saveCard } from "@/app/actions";
import GenericError from "@/utils/error";
import { ICardRequest } from "@/utils/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestBody: ICardRequest = await req.json();

  try {
    await saveCard(requestBody);

    return NextResponse.json(
      {
        message: "Card saved successfully",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);
    if (error instanceof GenericError) {
      return NextResponse.json(
        {
          message: error.message,
        },
        {
          status: error.statusCode,
        }
      );
    }

    return NextResponse.json(
      {
        message: "Failed to save card",
      },
      {
        status: 422,
      }
    );
  }
}
