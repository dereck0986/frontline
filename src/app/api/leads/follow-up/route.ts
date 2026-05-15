import { NextResponse } from "next/server";

const DEFAULT_SEQUENCE = [
  "0 min → instant response",
  "15 min → reminder",
  "2 hrs → soft follow-up",
  "24 hrs → value follow-up",
  "3 days → re-engagement",
  "7 days → nurture/recycle",
];

export async function POST() {
  return NextResponse.json({
    success: true,
    automation: "Frontline Follow-Up Engine",
    sequence: DEFAULT_SEQUENCE,
  });
}
