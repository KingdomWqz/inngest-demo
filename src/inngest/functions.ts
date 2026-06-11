import { inngest } from "@/lib/inngest";
import { timerState } from "@/lib/state";

export function createTimerFn(running: boolean) {
  return inngest.createFunction(
    {
      id: "cron-timer",
      triggers: running
        ? [{ cron: "* * * * *" }]
        : [{ event: "timer/noop" as string }],
    },
    async ({ step }) => {
      const appUrl = process.env.APP_URL ?? "http://localhost:3000";

      const time = await step.run("fetch-local-time", async () => {
        const res = await fetch(`${appUrl}/api/time`);
        return ((await res.json()) as { time: string }).time;
      });

      await step.run("store-time", () => {
        timerState.times = [time, ...timerState.times].slice(0, 20);
      });

      return { time };
    }
  );
}
