import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    time: new Date().toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" }),
  });
}
