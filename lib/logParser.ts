import type { LogAnalysisResult, RepeatedMessage } from "@/types/logs";

export function analyzeLogs(logText: string): LogAnalysisResult {
  // Split the pasted logs into separate lines.
  // Each line usually represents one log event.
  const lines = logText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  let errorCount = 0;
  let warningCount = 0;
  let timeoutCount = 0;
  let failureCount = 0;
  let exceptionCount = 0;

  const services = new Set<string>();
  const endpoints = new Set<string>();
  const ids = new Set<string>();

  const normalizedMessageCounts = new Map<string, number>();

  for (const line of lines) {
    const lowerLine = line.toLowerCase();

    if (lowerLine.includes("error")) {
      errorCount++;
    }

    if (lowerLine.includes("warn")) {
      warningCount++;
    }

    if (lowerLine.includes("timeout") || lowerLine.includes("timed out")) {
      timeoutCount++;
    }

    if (
      lowerLine.includes("failed") ||
      lowerLine.includes("failure") ||
      lowerLine.includes("500")
    ) {
      failureCount++;
    }

    if (lowerLine.includes("exception")) {
      exceptionCount++;
    }

    // Detect service names like PaymentService, AuthService, OrderService.
    // This regex looks for words ending with "Service".
    const serviceMatches = line.match(/\b[A-Z][A-Za-z0-9]*Service\b/g);
    if (serviceMatches) {
      serviceMatches.forEach((service) => services.add(service));
    }

    // Detect API endpoints like /api/payments or /users/login.
    const endpointMatches = line.match(/\/[a-zA-Z0-9/_-]+/g);
    if (endpointMatches) {
      endpointMatches.forEach((endpoint) => endpoints.add(endpoint));
    }

    // Detect IDs like order_id=1021, userId=88, payment_id=901.
    const idMatches = line.match(/\b[a-zA-Z_]*id[a-zA-Z_]*[=:]\s*[a-zA-Z0-9-]+\b/gi);
    if (idMatches) {
      idMatches.forEach((id) => ids.add(id));
    }

    // Normalize log lines so repeated failures can be counted.
    // We remove timestamps and numeric IDs because the same error may have different timestamps.
    const normalizedMessage = line
      .replace(/\d{4}-\d{2}-\d{2}/g, "")
      .replace(/\d{2}:\d{2}:\d{2}/g, "")
      .replace(/\b\d+\b/g, "{number}")
      .trim();

    normalizedMessageCounts.set(
      normalizedMessage,
      (normalizedMessageCounts.get(normalizedMessage) || 0) + 1
    );
  }

  const repeatedMessages: RepeatedMessage[] = Array.from(
    normalizedMessageCounts.entries()
  )
    .filter(([, count]) => count > 1)
    .map(([message, count]) => ({
      message,
      count,
    }));

  const suggestedActions = buildSuggestedActions({
    errorCount,
    warningCount,
    timeoutCount,
    failureCount,
    exceptionCount,
    services: Array.from(services),
    endpoints: Array.from(endpoints),
    repeatedMessages,
  });

  return {
    totalLines: lines.length,
    errorCount,
    warningCount,
    timeoutCount,
    failureCount,
    exceptionCount,
    services: Array.from(services),
    endpoints: Array.from(endpoints),
    ids: Array.from(ids),
    repeatedMessages,
    suggestedActions,
  };
}

function buildSuggestedActions(input: {
  errorCount: number;
  warningCount: number;
  timeoutCount: number;
  failureCount: number;
  exceptionCount: number;
  services: string[];
  endpoints: string[];
  repeatedMessages: RepeatedMessage[];
}): string[] {
  const actions: string[] = [];

  if (input.errorCount > 0) {
    actions.push("Review ERROR logs first because they usually indicate failed operations.");
  }

  if (input.timeoutCount > 0) {
    actions.push("Check downstream services, network latency, database queries, or API response times.");
  }

  if (input.failureCount > 0) {
    actions.push("Check recent deployments, failed API calls, and dependency health.");
  }

  if (input.exceptionCount > 0) {
    actions.push("Inspect stack traces and identify the exact class, method, or service throwing the exception.");
  }

  if (input.repeatedMessages.length > 0) {
    actions.push("Prioritize repeated messages because recurring failures usually point to a systemic issue.");
  }

  if (input.services.length > 0) {
    actions.push(`Start investigation with affected service(s): ${input.services.join(", ")}.`);
  }

  if (input.endpoints.length > 0) {
    actions.push(`Check failing endpoint(s): ${input.endpoints.join(", ")}.`);
  }

  if (actions.length === 0) {
    actions.push("No major error pattern detected. Review logs manually for business-specific warnings.");
  }

  return actions;
}