import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    provider: "vapi",
    message: "VAPI webhook received.",
  });
}
