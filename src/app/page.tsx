"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface TimerState {
  running: boolean;
  times: string[];
}

export default function Home() {
  const [state, setState] = useState<TimerState>({ running: false, times: [] });
  const [loading, setLoading] = useState(false);

  const fetchState = useCallback(async () => {
    const res = await fetch("/api/timer-state");
    const data: TimerState = await res.json();
    setState(data);
  }, []);

  useEffect(() => {
    fetchState();
    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [fetchState]);

  const handleAction = async (action: "start" | "pause") => {
    setLoading(true);
    const res = await fetch("/api/timer-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data: TimerState = await res.json();
    setState(data);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center p-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Inngest Cron Demo
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            每 5 分钟调用{" "}
            <code className="font-mono text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">
              /api/time
            </code>{" "}
            并记录本地时间
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              state.running
                ? "bg-green-500 animate-pulse"
                : "bg-zinc-300 dark:bg-zinc-600"
            }`}
          />
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {state.running ? "Running" : "Paused"}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => handleAction("start")}
            disabled={state.running || loading}
            className="flex-1 h-10 rounded-lg bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-medium transition-opacity disabled:opacity-30 hover:opacity-80"
          >
            Start
          </button>
          <button
            onClick={() => handleAction("pause")}
            disabled={!state.running || loading}
            className="flex-1 h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium transition-colors disabled:opacity-30 hover:bg-zinc-50 dark:hover:bg-zinc-800"
          >
            Pause
          </button>
        </div>

        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              Time Log
            </h2>
          </div>
          {state.times.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-zinc-400 dark:text-zinc-500">
              尚无记录，点击 Start 后等待 Cron 触发
            </div>
          ) : (
            <ul className="divide-y divide-zinc-50 dark:divide-zinc-800">
              {state.times.map((t, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5">
                  <span className="text-xs text-zinc-300 dark:text-zinc-600 w-5 text-right font-mono">
                    {i + 1}
                  </span>
                  <span className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                    {t}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex justify-end">
          <Link
            href="/chat"
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            前往 AI 对话 →
          </Link>
        </div>
      </div>
    </div>
  );
}
