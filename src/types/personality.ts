export interface AnalysisData {
  name: string;
  description: string;
  keyInsights: string;
  quoteMaxim: string;
}

export interface PersonalityAnalysis {
  [key: string]: AnalysisData;
} 