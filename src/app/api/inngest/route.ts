import { serve } from "inngest/next";
import { NextRequest } from "next/server";
import { inngest } from "@/lib/inngest";
import { createTimerFn } from "@/inngest/functions";
import { timerState } from "@/lib/state";

function handler() {
  return serve({ client: inngest, functions: [createTimerFn(timerState.running)] });
}

export async function GET(req: NextRequest) {
  return handler().GET(req, undefined);
}

export async function POST(req: NextRequest) {
  return handler().POST(req, undefined);
}

export async function PUT(req: NextRequest) {
  return handler().PUT(req, undefined);
}
