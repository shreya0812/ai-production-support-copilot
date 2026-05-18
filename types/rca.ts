export type RCASeverity = "Low" | "Medium" | "High" | "Critical";

export type RCAConfidence = "Low" | "Medium" | "High";

export type RCARelatedIncident = {
  title: string;
  service: string;
  severity: string;
  similarity: number;
  rootCause: string;
  resolution: string;
};

export type RCAReport = {
  title: string;
  severity: RCASeverity;
  confidence: RCAConfidence;
  summary: string;
  affectedServices: string[];
  affectedEndpoints: string[];
  likelyRootCause: string;
  evidence: string[];
  recommendedActions: string[];
  relatedIncidents: RCARelatedIncident[];
};