import type { SampleIncident } from "@/types/incidents";

export const sampleIncidents: SampleIncident[] = [
  {
    title: "Payment API timeout after deployment",
    service: "PaymentService",
    severity: "High",
    symptoms:
      "Repeated timeout errors while calling /api/payments. Retry attempts failed for multiple payment records.",
    rootCause:
      "Database connection pool exhaustion after a deployment increased concurrent payment requests.",
    resolution:
      "Increased database connection pool size, added retry backoff, and optimized slow payment lookup query.",
    tags: ["payment", "timeout", "database", "connection-pool"],
  },
  {
    title: "Authentication failures due to expired JWT signing key",
    service: "AuthService",
    severity: "Critical",
    symptoms:
      "Users received 401 responses from /api/login and /api/session. Logs showed token validation failures.",
    rootCause:
      "JWT signing key rotation completed, but one backend service still used the old cached public key.",
    resolution:
      "Refreshed key cache, fixed key rotation config, and added monitoring for token validation errors.",
    tags: ["auth", "jwt", "login", "401"],
  },
  {
    title: "Order creation failed because of missing database index",
    service: "OrderService",
    severity: "High",
    symptoms:
      "Order creation requests to /api/orders became slow and eventually failed with 500 errors.",
    rootCause:
      "A frequently used lookup query scanned the full orders table because a required index was missing.",
    resolution:
      "Added index on customer_id and order_status, then verified query latency returned to normal.",
    tags: ["orders", "500", "slow-query", "database-index"],
  },
  {
    title: "Kafka consumer lag caused delayed notifications",
    service: "NotificationService",
    severity: "Medium",
    symptoms:
      "Notification delivery was delayed. Logs showed consumer lag and repeated retry attempts.",
    rootCause:
      "Kafka consumer group could not keep up with the increased event volume after a batch job.",
    resolution:
      "Scaled consumers, tuned batch size, and added lag alerts for notification topics.",
    tags: ["kafka", "consumer-lag", "notifications", "retry"],
  },
  {
    title: "Inventory service returned stale data after cache failure",
    service: "InventoryService",
    severity: "Medium",
    symptoms:
      "Inventory API returned outdated stock values. Logs showed cache miss spikes and Redis errors.",
    rootCause:
      "Redis cache node became unavailable, and fallback logic used stale local cache values.",
    resolution:
      "Fixed cache fallback behavior, refreshed inventory cache, and added Redis health checks.",
    tags: ["inventory", "redis", "cache", "stale-data"],
  },
  {
    title: "Memory leak caused checkout service restart loop",
    service: "CheckoutService",
    severity: "Critical",
    symptoms:
      "Checkout requests failed intermittently. Logs showed out-of-memory errors and container restarts.",
    rootCause:
      "A new request aggregation feature stored large objects in memory without cleanup.",
    resolution:
      "Fixed object lifecycle cleanup, added memory usage alerts, and rolled back the risky release.",
    tags: ["checkout", "memory", "oom", "restart"],
  },
  {
    title: "Third-party shipping API failure blocked label creation",
    service: "ShippingService",
    severity: "High",
    symptoms:
      "Shipping labels failed to generate. Logs showed 502 responses from external carrier API.",
    rootCause:
      "External carrier API outage caused label creation requests to fail without fallback handling.",
    resolution:
      "Added retry with exponential backoff, fallback carrier handling, and clearer error messages.",
    tags: ["shipping", "third-party-api", "502", "labels"],
  },
  {
    title: "User profile update failed due to validation mismatch",
    service: "UserService",
    severity: "Low",
    symptoms:
      "Profile update API returned 400 errors for valid phone numbers and addresses.",
    rootCause:
      "Frontend validation allowed formats that backend validation rejected.",
    resolution:
      "Aligned frontend and backend validation rules and added shared validation test cases.",
    tags: ["user", "validation", "400", "profile"],
  },
  {
    title: "Report generation timed out for large accounts",
    service: "ReportService",
    severity: "Medium",
    symptoms:
      "Large account reports timed out after 30 seconds. Logs showed long-running SQL queries.",
    rootCause:
      "Report generation executed expensive joins synchronously during API request processing.",
    resolution:
      "Moved report generation to an async background job and added pagination for report data.",
    tags: ["reports", "timeout", "async-job", "sql"],
  },
  {
    title: "Database connection failure during payment reconciliation",
    service: "ReconciliationService",
    severity: "High",
    symptoms:
      "Reconciliation job failed repeatedly. Logs showed database connection errors and retry failures.",
    rootCause:
      "Database maintenance window overlapped with the scheduled reconciliation job.",
    resolution:
      "Updated job schedule, added maintenance window awareness, and improved retry strategy.",
    tags: ["reconciliation", "database", "connection", "scheduled-job"],
  },
];

export function buildIncidentDocument(incident: SampleIncident): string {
  return `
Title: ${incident.title}
Service: ${incident.service}
Severity: ${incident.severity}
Symptoms: ${incident.symptoms}
Root Cause: ${incident.rootCause}
Resolution: ${incident.resolution}
Tags: ${incident.tags.join(", ")}
`.trim();
}