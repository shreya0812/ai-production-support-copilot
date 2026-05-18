import { generateRCAReport } from "@/lib/gemini";
import { searchSimilarIncidents } from "@/lib/incidentSearch";
import { analyzeLogs } from "@/lib/logParser";
import { buildRCAPrompt } from "@/lib/rcaPrompt";

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

    const { matches } = await searchSimilarIncidents(logText, analysis, {
      matchCount: 3,
      matchThreshold: 0.2,
    });

    const prompt = buildRCAPrompt({
      logText,
      analysis,
      matches,
    });

    const rcaReport = await generateRCAReport(prompt);

    return Response.json({
      success: true,
      analysis,
      matches,
      rcaReport,
    });
  } catch {
    return Response.json(
      {
        success: false,
        error: "Failed to generate RCA report.",
      },
      { status: 500 }
    );
  }
}