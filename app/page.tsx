"use client";

import { useState } from "react";
import type { LogAnalysisResult } from "@/types/logs";

const sampleLogs = `2026-05-16 10:12:44 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:13:01 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:14:10 WARN Retry attempt failed for order_id=1021
2026-05-16 10:15:22 ERROR Database connection failed
2026-05-16 10:16:03 ERROR AuthService failed while calling /api/login userId=88`;

export default function Home() {
  const [logText, setLogText] = useState(sampleLogs);
  const [analysis, setAnalysis] = useState<LogAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleAnalyzeLogs() {
    setIsLoading(true);
    setErrorMessage("");
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze logs.");
      }

      setAnalysis(data.analysis);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            AI Production Support Copilot
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Log Error Analyzer
          </h1>

          <p className="max-w-3xl text-slate-600">
            Paste application logs below. The analyzer will detect errors,
            warnings, timeouts, repeated failures, affected services, endpoints,
            IDs, and recommended debugging steps.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Input Logs</h2>
              <button
                onClick={() => setLogText(sampleLogs)}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={logText}
              onChange={(event) => setLogText(event.target.value)}
              className="h-96 w-full rounded-xl border border-slate-300 bg-slate-950 p-4 font-mono text-sm text-slate-100 outline-none focus:border-slate-500"
              placeholder="Paste logs here..."
            />

            <button
              onClick={handleAnalyzeLogs}
              disabled={isLoading}
              className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isLoading ? "Analyzing..." : "Analyze Logs"}
            </button>

            {errorMessage && (
              <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Analysis Result</h2>

            {!analysis ? (
              <div className="flex h-96 items-center justify-center rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
                Run the analyzer to see results here.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <MetricCard label="Total Lines" value={analysis.totalLines} />
                  <MetricCard label="Errors" value={analysis.errorCount} />
                  <MetricCard label="Warnings" value={analysis.warningCount} />
                  <MetricCard label="Timeouts" value={analysis.timeoutCount} />
                  <MetricCard label="Failures" value={analysis.failureCount} />
                  <MetricCard label="Exceptions" value={analysis.exceptionCount}/>
                </div>

                <ResultSection title="Affected Services" items={analysis.services} />
                <ResultSection title="Detected Endpoints" items={analysis.endpoints} />
                <ResultSection title="Detected IDs" items={analysis.ids} />

                <div>
                  <h3 className="mb-2 font-semibold">Repeated Messages</h3>
                  {analysis.repeatedMessages.length === 0 ? (
                    <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
                      No repeated messages detected.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {analysis.repeatedMessages.map((item, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm"
                        >
                          <p className="font-medium">Repeated {item.count} times</p>
                          <p className="mt-1 font-mono text-xs text-slate-600">
                            {item.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ResultSection
                  title="Suggested Debugging Actions"
                  items={analysis.suggestedActions}
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

function ResultSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="mb-2 font-semibold">{title}</h3>

      {items.length === 0 ? (
        <p className="rounded-lg bg-slate-50 p-3 text-sm text-slate-500">
          None detected.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}