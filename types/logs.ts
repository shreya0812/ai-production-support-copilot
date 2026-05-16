export type RepeatedMessage = {
  message: string;
  count: number;
};

export type LogAnalysisResult = {
  totalLines: number;
  errorCount: number;
  warningCount: number;
  timeoutCount: number;
  failureCount: number;
  exceptionCount: number;
  services: string[];
  endpoints: string[];
  ids: string[];
  repeatedMessages: RepeatedMessage[];
  suggestedActions: string[];
};