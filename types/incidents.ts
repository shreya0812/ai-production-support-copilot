export type SampleIncident = {
  title: string;
  service: string;
  severity: "Low" | "Medium" | "High" | "Critical";
  symptoms: string;
  rootCause: string;
  resolution: string;
  tags: string[];
};

export type IncidentMatch = {
  id: number;
  title: string;
  service: string;
  severity: string;
  symptoms: string;
  root_cause: string;
  resolution: string;
  tags: string[];
  similarity: number;
};