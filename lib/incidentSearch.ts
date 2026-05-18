import { createEmbedding } from "@/lib/gemini";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { IncidentMatch } from "@/types/incidents";
import type { LogAnalysisResult } from "@/types/logs";

export async function searchSimilarIncidents(
  logText: string,
  analysis: LogAnalysisResult,
  options?: {
    matchCount?: number;
    matchThreshold?: number;
  }
): Promise<{
  searchText: string;
  matches: IncidentMatch[];
}> {
  const searchText = buildIncidentSearchText(logText, analysis);
  const queryEmbedding = await createEmbedding(searchText);

  const { data, error } = await supabaseAdmin.rpc("match_incidents", {
    query_embedding: queryEmbedding,
    match_count: options?.matchCount ?? 3,
    match_threshold: options?.matchThreshold ?? 0.2,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    searchText,
    matches: (data ?? []) as IncidentMatch[],
  };
}

export function buildIncidentSearchText(
  logText: string,
  analysis: LogAnalysisResult
): string {
  const repeatedMessages = analysis.repeatedMessages
    .map((item) => `${item.message} repeated ${item.count} times`)
    .join("; ");

  return `
Production log issue summary:

Error count: ${analysis.errorCount}
Warning count: ${analysis.warningCount}
Timeout count: ${analysis.timeoutCount}
Failure count: ${analysis.failureCount}
Exception count: ${analysis.exceptionCount}

Affected services: ${analysis.services.join(", ") || "Unknown"}
Affected endpoints: ${analysis.endpoints.join(", ") || "Unknown"}
Detected IDs: ${analysis.ids.join(", ") || "None"}
Repeated messages: ${repeatedMessages || "None"}

Raw log sample:
${logText.slice(0, 2000)}
`.trim();
}