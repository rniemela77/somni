export interface Assessment {
  id: string;
  displayName: string;
  positive: string;
  negative: string;
  positive_label: string;
  negative_label: string;
  title: string;
  slug: string;
  description: string;
  traits: {
    positive: AssessmentTrait;
    negative: AssessmentTrait;
  };
  questions: Question[];
}


// Quiz-related types
export interface Question {
  id: string;
  points: number;
  statementA: string;
  statementB: string;
}

export interface AssessmentWithScore extends Assessment {
  score: number;
}

export interface AssessmentTrait {
  name: string;
  strength: string;
  blindspot: string;
  description: string;
  keywords?: string[];
}

export interface AssessmentScore {
  [key: string]: number;
}

// User-related types
export interface UserData {
  id: string;
  assessmentScores: AssessmentScore;
  personalityAnalysis: PersonalityAnalysis;
  mythicMirror: MythicMirrorEntry[];
  openaiApiCalls: number;
  payments: Payment[];
  createdAt?: any;
  updatedAt?: any;
}

export interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: any;
  updatedAt: any;
}

export interface MythicMirrorEntry {
  challenge: string;
  response: {
    title: string;
    details: string;
  };
  createdAt: any;
}

// Firebase personality analysis
export interface PersonalityAnalysis {
  [key: string]: {
    title: string;
    details: string;
    personaQuote?: string;
  };
}

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  providerId: string;
}

// Personality analysis types
export interface PersonalityCategory {
  id: 'innerRealm' | 'mythicMirror' | 'cosmicPath';
  description: string;
}

export interface PersonalitySectionPromptInstructions {
  title: string;
  details: string;
  personaQuote?: string;
}

// This matches the actual structure in shared/config/personalityAnalysis.js
export interface PersonalitySection {
  id: string;
  slug: string;
  requiredAssessments: number;
  title: string;
  description: string;
  promptInstructions: PersonalitySectionPromptInstructions;
  category?: string;
  icon?: string;
}

export interface ExtendedPersonalitySection extends PersonalitySection {
  // Additional properties for extended functionality
}

export interface PersonalityAttributes {
  [key: string]: any;
}

// Type for the sections array
export type PersonalityAnalysisSections = PersonalitySection[];



export interface RevelationConfig {
  key: string;
  requiredAssessments: number;
  title: string;
  description: string;
}