import { NextRequest, NextResponse } from "next/server";
import { timerState } from "@/lib/state";

export function GET() {
  return NextResponse.json({ running: timerState.running, times: timerState.times });
}

export async function POST(req: NextRequest) {
  const { action } = (await req.json()) as { action: "start" | "pause" };

  if (action === "start") {
    timerState.running = true;
  } else if (action === "pause") {
    timerState.running = false;
  }

  const appUrl = process.env.APP_URL ?? "http://localhost:3000";
  await fetch(`${appUrl}/api/inngest`, { method: "PUT" }).catch(() => {});

  return NextResponse.json({ running: timerState.running, times: timerState.times });
}
