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
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
  Zap,
} from "lucide-react";
import type { IncidentMatch } from "@/types/incidents";
import type { LogAnalysisResult } from "@/types/logs";
import type { RCAReport as RCAReportType } from "@/types/rca";

const sampleLogs = `2026-05-16 10:12:44 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:13:01 ERROR PaymentService timeout while calling /api/payments
2026-05-16 10:14:10 WARN Retry attempt failed for order_id=1021
2026-05-16 10:15:22 ERROR Database connection failed
2026-05-16 10:16:03 ERROR AuthService failed while calling /api/login userId=88`;

type ResultMode = "analysis" | "incidents" | "rca" | null;

export default function Home() {
  const [logText, setLogText] = useState(sampleLogs);
  const [analysis, setAnalysis] = useState<LogAnalysisResult | null>(null);
  const [incidentMatches, setIncidentMatches] = useState<IncidentMatch[]>([]);
  const [rcaReport, setRcaReport] = useState<RCAReportType | null>(null);
  const [resultMode, setResultMode] = useState<ResultMode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearchingIncidents, setIsSearchingIncidents] = useState(false);
  const [isGeneratingRca, setIsGeneratingRca] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isBusy = isLoading || isSearchingIncidents || isGeneratingRca;

  async function handleAnalyzeLogs() {
    setIsLoading(true);
    setErrorMessage("");
    setAnalysis(null);
    setIncidentMatches([]);
    setRcaReport(null);
    setResultMode(null);

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
      setResultMode("analysis");
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
    setAnalysis(null);
    setIncidentMatches([]);
    setRcaReport(null);
    setResultMode(null);

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
      setResultMode("incidents");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsSearchingIncidents(false);
    }
  }

  async function handleGenerateRcaReport() {
    setIsGeneratingRca(true);
    setErrorMessage("");
    setAnalysis(null);
    setIncidentMatches([]);
    setRcaReport(null);
    setResultMode(null);

    try {
      const response = await fetch("/api/rca-agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ logText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate RCA report.");
      }

      setAnalysis(data.analysis);
      setIncidentMatches(data.matches);
      setRcaReport(data.rcaReport);
      setResultMode("rca");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsGeneratingRca(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f8fb] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-8">
        <section className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">
            <TerminalSquare className="h-3.5 w-3.5" />
            AI Production Support Copilot
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
              Log Error Analyzer
            </h1>
            <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
              Paste application logs to detect failures, summarize patterns,
              retrieve similar historical incidents, and generate an
              evidence-backed root cause analysis report.
            </p>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
          <aside className="self-start rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm xl:sticky xl:top-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-slate-950">
                  Input Logs
                </h2>
              </div>

              <button
                onClick={() => setLogText(sampleLogs)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={logText}
              onChange={(event) => setLogText(event.target.value)}
              className="h-96 w-full rounded-2xl border border-slate-800 bg-[#080d18] p-4 font-mono text-sm leading-6 text-slate-100 shadow-inner outline-none placeholder:text-slate-500 focus:border-teal-500"
              placeholder="Paste logs here..."
            />

            <button
              onClick={handleAnalyzeLogs}
              disabled={isBusy}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              <Zap className="h-4 w-4 text-teal-300" />
              {isLoading ? "Analyzing..." : "Analyze Logs"}
            </button>

            <button
              onClick={handleSearchSimilarIncidents}
              disabled={isBusy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-teal-700 bg-teal-700 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Search className="h-4 w-4" />
              {isSearchingIncidents
                ? "Searching Similar Incidents..."
                : "Find Similar Incidents"}
            </button>

            <button
              onClick={handleGenerateRcaReport}
              disabled={isBusy}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-900 bg-white px-4 py-3 font-semibold text-slate-950 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-100 disabled:text-slate-400"
            >
              <Sparkles className="h-4 w-4 text-teal-700" />
              {isGeneratingRca
                ? "Generating RCA Report..."
                : "Generate RCA Report"}
            </button>

            {errorMessage && (
              <p className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
                  <ShieldCheck className="h-4 w-4 text-teal-700" />
                </div>
                <h3 className="text-sm font-semibold text-slate-950">
                  How to use
                </h3>
              </div>

              <ul className="space-y-3 text-sm text-slate-600">
                {[
                  "Paste raw application logs",
                  "Click Analyze Logs for rule-based insights",
                  "Click Find Similar Incidents to search historical incidents",
                  "Click Generate RCA Report for evidence-backed root cause analysis",
                  "Review suggested actions, matched incidents, and RCA report",
                ].map((item, index) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      {index + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <section className="space-y-4">
            {!resultMode && <EmptyState />}

            {resultMode === "analysis" && analysis && (
              <AnalysisResult analysis={analysis} />
            )}

            {resultMode === "incidents" && (
              <IncidentMatches matches={incidentMatches} />
            )}

            {resultMode === "rca" && rcaReport && (
                <RCAReportCard report={rcaReport} />
            )}
          </section>
        </section>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[520px] items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
      <div className="max-w-md">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900">
          <TerminalSquare className="h-6 w-6 text-teal-300" />
        </div>
        <h2 className="mt-5 text-xl font-semibold text-slate-950">
          Start with a log analysis
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Use Analyze Logs to view extracted patterns, Find Similar Incidents
          to retrieve historical incidents, or Generate RCA Report to run the
          full workflow.
        </p>
      </div>
    </div>
  );
}

function AnalysisResult({ analysis }: { analysis: LogAnalysisResult }) {
  return (
    <>
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <SectionHeader
          icon={<Activity className="h-4 w-4" />}
          title="Analysis Overview"
          description="High-level signal extracted from the pasted logs."
        />

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
          <MetricCard
            label="Total Lines"
            value={analysis.totalLines}
            icon={<Activity className="h-3.5 w-3.5" />}
            iconBg="bg-slate-100"
            iconColor="text-slate-700"
          />
          <MetricCard
            label="Errors"
            value={analysis.errorCount}
            icon={<AlertCircle className="h-3.5 w-3.5" />}
            iconBg="bg-red-50"
            iconColor="text-red-600"
          />
          <MetricCard
            label="Warnings"
            value={analysis.warningCount}
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />
          <MetricCard
            label="Timeouts"
            value={analysis.timeoutCount}
            icon={<Clock3 className="h-3.5 w-3.5" />}
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />
          <MetricCard
            label="Failures"
            value={analysis.failureCount}
            icon={<CircleX className="h-3.5 w-3.5" />}
            iconBg="bg-rose-50"
            iconColor="text-rose-600"
          />
          <MetricCard
            label="Exceptions"
            value={analysis.exceptionCount}
            icon={<Code2 className="h-3.5 w-3.5" />}
            iconBg="bg-teal-50"
            iconColor="text-teal-700"
          />
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <ResultSection
          title="Affected Services"
          items={analysis.services}
          icon={<Server className="h-4 w-4" />}
        />

        <ResultSection
          title="Detected Endpoints"
          items={analysis.endpoints}
          icon={<Link2 className="h-4 w-4" />}
        />

        <ResultSection
          title="Detected IDs"
          items={analysis.ids}
          icon={<FileText className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)]">
        <RepeatedMessagesSection
          repeatedMessages={analysis.repeatedMessages}
        />

        <ActionSection items={analysis.suggestedActions} />
      </div>
    </>
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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
        <div className="text-teal-700">{icon}</div>
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
}: {
  title: string;
  items: string[];
  icon: ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
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
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <Workflow className="h-4 w-4 text-amber-600" />
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
              className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4"
            >
              <div className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-700">
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
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50">
          <ShieldCheck className="h-4 w-4 text-teal-700" />
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
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
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
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-50">
          <Search className="h-5 w-5 text-teal-700" />
        </div>

        <div>
          <h2 className="text-xl font-semibold text-slate-950">
            Similar Historical Incidents
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Retrieved using vector similarity search over historical incident
            records.
          </p>
        </div>
      </div>

      {matches.length === 0 ? (
        <p className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
          No similar incidents found yet. Check that incidents are seeded in
          Supabase, then try again.
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

                  <span className="shrink-0 rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white">
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

function RCAReportCard({ report }: { report: RCAReportType }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900">
            <Sparkles className="h-5 w-5 text-teal-300" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-950">
              Root Cause Analysis Report
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Generated from log analysis, similar incidents, and grounded AI
              reasoning.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700">
            {report.severity} Severity
          </span>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
            {report.confidence} Confidence
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Incident Title
            </p>
            <h3 className="mt-2 text-base font-semibold text-slate-950">
              {report.title}
            </h3>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Summary
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {report.summary}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Likely Root Cause
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              {report.likelyRootCause}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <RCAListSection title="Evidence" items={report.evidence} />

          <RCAListSection
            title="Recommended Actions"
            items={report.recommendedActions}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Affected Services
          </p>

          {report.affectedServices.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">None detected.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {report.affectedServices.map((service, index) => (
                <span
                  key={`${service}-${index}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {service}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Affected Endpoints
          </p>

          {report.affectedEndpoints.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">None detected.</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {report.affectedEndpoints.map((endpoint, index) => (
                <span
                  key={`${endpoint}-${index}`}
                  className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {endpoint}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {report.relatedIncidents.length > 0 && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Related Incidents Used as Evidence
          </p>

          <div className="mt-3 space-y-3">
            {report.relatedIncidents.map((incident, index) => (
              <div
                key={`${incident.title}-${index}`}
                className="rounded-2xl border border-slate-200 bg-white p-4"
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-950">
                      {incident.title}
                    </h4>
                    <p className="mt-1 text-xs text-slate-500">
                      {incident.service} • {incident.severity}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-teal-700 px-2.5 py-1 text-xs font-semibold text-white">
                    {(incident.similarity * 100).toFixed(1)}% match
                  </span>
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-950">
                    Root Cause:
                  </span>{" "}
                  {incident.rootCause}
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  <span className="font-semibold text-slate-950">
                    Resolution:
                  </span>{" "}
                  {incident.resolution}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RCAListSection({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </p>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">None available.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="flex gap-3 text-sm leading-6 text-slate-700"
            >
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
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