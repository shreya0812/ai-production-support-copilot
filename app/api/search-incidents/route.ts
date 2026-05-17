import { createEmbedding } from "@/lib/gemini";
import { analyzeLogs } from "@/lib/logParser";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { LogAnalysisResult } from "@/types/logs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const logText = body.logText;

    if (!logText || typeof logText !== "string") {
      return Response.json(
        { success: false, error: "logText is required and must be a string." },
        { status: 400 }
      );
    }

    const analysis = analyzeLogs(logText);
    const searchText = buildSearchText(logText, analysis);
    const queryEmbedding = await createEmbedding(searchText);

    const { data, error } = await supabaseAdmin.rpc("match_incidents", {
      query_embedding: queryEmbedding,
      match_count: 3,
      match_threshold: 0.2,
    });

    if (error) {
      return Response.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return Response.json({
      success: true,
      analysis,
      searchText,
      matches: data ?? [],
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Failed to search similar incidents.",
      },
      { status: 500 }
    );
  }
}

function buildSearchText(
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