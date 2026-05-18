import type { IncidentMatch } from "@/types/incidents";
import type { LogAnalysisResult } from "@/types/logs";

export function buildRCAPrompt(input: {
  logText: string;
  analysis: LogAnalysisResult;
  matches: IncidentMatch[];
}): string {
  const { logText, analysis, matches } = input;

  const incidentContext =
    matches.length === 0
      ? "No similar historical incidents were found."
      : matches
          .map((incident, index) => {
            return `
Incident ${index + 1}:
Title: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Similarity: ${(incident.similarity * 100).toFixed(1)}%
Symptoms: ${incident.symptoms}
Root Cause: ${incident.root_cause}
Resolution: ${incident.resolution}
Tags: ${incident.tags.join(", ")}
`.trim();
          })
          .join("\n\n");

  const repeatedMessages =
    analysis.repeatedMessages.length === 0
      ? "None"
      : analysis.repeatedMessages
          .map((item) => `${item.message} repeated ${item.count} times`)
          .join("; ");

  return `
You are an AI production support assistant.

Your task:
Generate a root cause analysis report using ONLY the provided log analysis and historical incident matches.

Important rules:
- Do not invent services, endpoints, incidents, or database records.
- If evidence is weak, set confidence to "Low" or "Medium".
- If similar incidents are available, use them as supporting evidence.
- Keep the report practical for a software engineer debugging production.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Current log analysis:
Total lines: ${analysis.totalLines}
Error count: ${analysis.errorCount}
Warning count: ${analysis.warningCount}
Timeout count: ${analysis.timeoutCount}
Failure count: ${analysis.failureCount}
Exception count: ${analysis.exceptionCount}
Affected services: ${analysis.services.join(", ") || "Unknown"}
Affected endpoints: ${analysis.endpoints.join(", ") || "Unknown"}
Detected IDs: ${analysis.ids.join(", ") || "None"}
Repeated messages: ${repeatedMessages}

Historical incident matches:
${incidentContext}

Raw log sample:
${logText.slice(0, 2500)}

Return JSON in this exact shape:
{
  "title": "short incident title",
  "severity": "Low | Medium | High | Critical",
  "confidence": "Low | Medium | High",
  "summary": "brief summary of what is happening",
  "affectedServices": ["service names"],
  "affectedEndpoints": ["endpoint names"],
  "likelyRootCause": "most likely root cause based on evidence",
  "evidence": ["evidence point 1", "evidence point 2", "evidence point 3"],
  "recommendedActions": ["action 1", "action 2", "action 3"],
  "relatedIncidents": [
    {
      "title": "incident title",
      "service": "service name",
      "severity": "severity",
      "similarity": 0.91,
      "rootCause": "historical root cause",
      "resolution": "historical resolution"
    }
  ]
}
`.trim();
}