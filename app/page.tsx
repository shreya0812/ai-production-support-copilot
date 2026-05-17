"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CircleX,
  Clock3,
  Code2,
  FileText,
  Link2,
  Search,
  Server,
  ShieldAlert,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";
import type { IncidentMatch } from "@/types/incidents";
import type { LogAnalysisResult } from "@/types/logs";

const sampleLogs = `2026-05-16 10:12:44 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:13:01 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:14:10 WARN Retry attempt failed for order_id=1021
2026-05-16 10:15:22 ERROR Database connection failed
2026-05-16 10:16:03 ERROR AuthService failed while calling /api/login userId=88`;

export default function Home() {
  const [logText, setLogText] = useState(sampleLogs);
  const [analysis, setAnalysis] = useState<LogAnalysisResult | null>(null);
  const [incidentMatches, setIncidentMatches] = useState<IncidentMatch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingIncidents, setIsSearchingIncidents] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isBusy = isLoading || isSearchingIncidents;

  async function handleAnalyzeLogs() {
    setIsLoading(true);
    setErrorMessage("");
    setAnalysis(null);
    setIncidentMatches([]);

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

  async function handleSearchSimilarIncidents() {
    setIsSearchingIncidents(true);
    setErrorMessage("");
    setIncidentMatches([]);

    try {
      const response = await fetch("/api/search-incidents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to search similar incidents.");
      }

      setAnalysis(data.analysis);
      setIncidentMatches(data.matches);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSearchingIncidents(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#eef2ff,transparent_35%),linear-gradient(to_bottom,#f8fafc,#ffffff)] px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <section className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI Production Support Copilot
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Log Error Analyzer
              </h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                Paste application logs to detect failures, summarize patterns,
                and retrieve similar historical incidents with likely root
                causes and resolutions.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <aside className="self-start rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur xl:sticky xl:top-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-100">
                  <FileText className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Input Logs
                </h2>
              </div>

              <button
                onClick={() => setLogText(sampleLogs)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={logText}
              onChange={(event) => setLogText(event.target.value)}
              className="h-96 w-full rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 shadow-inner outline-none ring-0 placeholder:text-slate-500 focus:border-violet-500"
              placeholder="Paste logs here..."
            />

            <button
              onClick={handleAnalyzeLogs}
              disabled={isBusy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
            >
              <Zap className="h-4 w-4" />
              {isLoading ? "Analyzing..." : "Analyze Logs"}
            </button>

            <button
              onClick={handleSearchSimilarIncidents}
              disabled={isBusy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Search className="h-4 w-4" />
              {isSearchingIncidents
                ? "Searching Similar Incidents..."
                : "Find Similar Incidents"}
            </button>

            {errorMessage && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                  <ShieldAlert className="h-4 w-4 text-violet-600" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  How to use
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  "Paste raw application logs",
                  "Click Analyze Logs for rule-based insights",
                  "Click Find Similar Incidents to search historical incidents",
                  "Review suggested actions and likely root causes",
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="space-y-4">
            {!analysis ? (
              <EmptyState />
            ) : (
              <>
                <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                  <SectionHeader
                    icon={<Activity className="h-4 w-4" />}
                    title="Analysis Overview"
                    description="High-level signal extracted from the pasted logs."
                  />

                  <div className="mt-5 grid grid-cols-2 gap-2 lg:grid-cols-3 xl:grid-cols-6">
                    <MetricCard
                      label="Total Lines"
                      value={analysis.totalLines}
                      icon={<Activity className="h-5 w-5" />}
                      iconBg="bg-violet-100"
                      iconColor="text-violet-600"
                    />
                    <MetricCard
                      label="Errors"
                      value={analysis.errorCount}
                      icon={<AlertCircle className="h-5 w-5" />}
                      iconBg="bg-red-100"
                      iconColor="text-red-600"
                    />
                    <MetricCard
                      label="Warnings"
                      value={analysis.warningCount}
                      icon={<AlertTriangle className="h-5 w-5" />}
                      iconBg="bg-amber-100"
                      iconColor="text-amber-600"
                    />
                    <MetricCard
                      label="Timeouts"
                      value={analysis.timeoutCount}
                      icon={<Clock3 className="h-5 w-5" />}
                      iconBg="bg-blue-100"
                      iconColor="text-blue-600"
                    />
                    <MetricCard
                      label="Failures"
                      value={analysis.failureCount}
                      icon={<CircleX className="h-5 w-5" />}
                      iconBg="bg-pink-100"
                      iconColor="text-pink-600"
                    />
                    <MetricCard
                      label="Exceptions"
                      value={analysis.exceptionCount}
                      icon={<Code2 className="h-5 w-5" />}
                      iconBg="bg-cyan-100"
                      iconColor="text-cyan-600"
                    />
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-3">
                  <ResultSection
                    title="Affected Services"
                    items={analysis.services}
                    icon={<Server className="h-4 w-4" />}
                    iconBg="bg-violet-100"
                    iconColor="text-violet-600"
                  />

                  <ResultSection
                    title="Detected Endpoints"
                    items={analysis.endpoints}
                    icon={<Link2 className="h-4 w-4" />}
                    iconBg="bg-indigo-100"
                    iconColor="text-indigo-600"
                  />

                  <ResultSection
                    title="Detected IDs"
                    items={analysis.ids}
                    icon={<FileText className="h-4 w-4" />}
                    iconBg="bg-purple-100"
                    iconColor="text-purple-600"
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
                  <RepeatedMessagesSection
                    repeatedMessages={analysis.repeatedMessages}
                  />

                  <ActionSection items={analysis.suggestedActions} />
                </div>

                <IncidentMatches matches={incidentMatches} />
              </>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white/80 p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100">
          <Sparkles className="h-6 w-6 text-violet-600" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-950">
          Run the analyzer to see results
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          The analysis panel will show error counts, affected services,
          repeated failures, suggested actions, and similar historical
          incidents.
        </p>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
        <div className="text-violet-600">{icon}</div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-3 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>

        <p className="text-3xl font-bold text-slate-950">{value}</p>
      </div>
    </div>
  );
}

function ResultSection({
  title,
  items,
  icon,
  iconBg,
  iconColor,
}: {
  title: string;
  items: string[];
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>

        <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">None detected.</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function RepeatedMessagesSection({
  repeatedMessages,
}: {
  repeatedMessages: LogAnalysisResult["repeatedMessages"];
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
          <Workflow className="h-4 w-4 text-violet-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-950">
          Repeated Messages
        </h3>
      </div>

      {repeatedMessages.length === 0 ? (
        <p className="text-sm text-slate-500">
          No repeated messages detected.
        </p>
      ) : (
        <div className="space-y-3">
          {repeatedMessages.map((item, index) => (
            <div
              key={`${item.message}-${index}`}
              className="rounded-2xl border border-red-100 bg-red-50 p-4"
            >
              <div className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-red-700">
                Repeated {item.count} times
              </div>

              <p className="font-mono text-xs leading-5 text-slate-700">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ActionSection({ items }: { items: string[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
          <Sparkles className="h-4 w-4 text-violet-600" />
        </div>
        <h3 className="text-base font-semibold text-slate-950">
          Suggested Debugging Actions
        </h3>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No suggestions available.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-700"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-600 text-xs font-semibold text-white">
                {index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IncidentMatches({ matches }: { matches: IncidentMatch[] }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
          <Search className="h-4 w-4 text-violet-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-950">
            Similar Historical Incidents
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Retrieved using vector similarity search over historical incident
            records.
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          No similar incidents found yet. Try clicking "Find Similar Incidents" after analyzing the logs.
        </p>
      ) : (
        <div className="space-y-4">
          {matches.map((incident) => (
            <div
              key={incident.id}
              className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"
            >
              <div>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold text-slate-950">
                      {incident.title}
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      {incident.service} • {incident.severity}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-700">
                    {(incident.similarity * 100).toFixed(1)}% match
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-950">
                    Symptoms:
                  </span>{" "}
                  {incident.symptoms}
                </p>
              </div>

              <div className="space-y-3 text-sm leading-6 text-slate-700">
                <p>
                  <span className="font-semibold text-slate-950">
                    Root Cause:
                  </span>{" "}
                  {incident.root_cause}
                </p>

                <p>
                  <span className="font-semibold text-slate-950">
                    Resolution:
                  </span>{" "}
                  {incident.resolution}
                </p>

                {incident.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {incident.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}