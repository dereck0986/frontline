import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalLeads: 42,
    qualifiedLeads: 18,
    followUpsDue: 7,
    appointmentsBooked: 11,
    lostLeads: 5,
    revenueOpportunity: 84500,
  });
}
