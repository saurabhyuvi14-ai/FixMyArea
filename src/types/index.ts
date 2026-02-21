export interface LocationData {
  latitude: number;
  longitude: number;
  address: string;
}

export interface IssueAnalysis {
  issueType: string;
  confidence: number;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  suggestedActions: string[];
}

export interface ComplaintData {
  issueType: string;
  location: LocationData;
  description: string;
  imageUrl?: string;
  timestamp: string;
}

export interface GeneratedComplaint {
  subject: string;
  body: string;
  recipient: string;
  fullComplaint: string;
}

export interface ReportState {
  image: File | null;
  imagePreview: string | null;
  location: LocationData | null;
  analysis: IssueAnalysis | null;
  complaint: GeneratedComplaint | null;
  isAnalyzing: boolean;
  isGeneratingComplaint: boolean;
  isDetectingLocation: boolean;
  error: string | null;
}

export type IssueCategory =
  | "road_damage"
  | "garbage_accumulation"
  | "water_leakage"
  | "street_light"
  | "traffic_signal"
  | "illegal_parking"
  | "graffiti"
  | "sidewalk_damage"
  | "drainage_issue"
  | "other";

export interface IssueTypeInfo {
  id: IssueCategory;
  label: string;
  icon: string;
  department: string;
}
