
export interface Report {
  id?: string;
  name: string;
  mobile: string;
  place: string;
  incident_date: string;
  reporting_date: string;
  description: string;
  crime_type: string;
  extracted_text?: string;
}

export interface Block {
  index: number;
  timestamp: string;
  previous_hash: string;
  data: any;
  hash: string;
}

// Backend API response types
export interface ApiResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ClassificationResponse {
  crime_type: string;
}

export interface ExtractedTextResponse {
  extracted_text: string;
}

