export interface AnalysisData {
  "Name": string;
  "Description": string;
  "Key Insights": string;
  "Quote/Maxim": string;
  "Quote/Maxim Source": string;
}

export interface PersonalityAnalysis {
  [key: string]: AnalysisData;
} 