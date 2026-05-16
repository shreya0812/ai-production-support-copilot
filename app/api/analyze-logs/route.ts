import { analyzeLogs } from "@/lib/logParser";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const logText = body.logText;

    if (!logText || typeof logText !== "string") {
      return Response.json(
        { error: "logText is required and must be a string." },
        { status: 400 }
      );
    }

    const analysis = analyzeLogs(logText);

    return Response.json({
      success: true,
      analysis,
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: "Failed to analyze logs.",
      },
      { status: 500 }
    );
  }
}