
import { Report, Block, ApiResponse, ClassificationResponse, ExtractedTextResponse } from '@/types';

// Base URL for the API - replace with your actual backend URL when deployed
const API_BASE_URL = 'http://localhost:8000';

// Mock data for when API calls fail
const MOCK_REPORTS: Report[] = [
  {
    id: "1",
    name: "John Doe",
    mobile: "+1-555-123-4567",
    place: "New York City",
    incident_date: "2023-05-15T10:30:00",
    reporting_date: "2023-05-16T09:15:00",
    description: "My email account was compromised and the attacker sent phishing emails to my contacts.",
    crime_type: "Phishing",
    extracted_text: "Suspicious login detected from IP 192.168.1.1 at 2:30 AM EST"
  },
  {
    id: "2",
    name: "Jane Smith",
    mobile: "+1-555-987-6543",
    place: "San Francisco",
    incident_date: "2023-06-20T14:45:00",
    reporting_date: "2023-06-20T16:30:00",
    description: "My computer was infected with ransomware and all my files were encrypted. The attackers demanded $500 in Bitcoin.",
    crime_type: "Ransomware",
  },
  {
    id: "3",
    name: "Michael Johnson",
    mobile: "+1-555-456-7890",
    place: "Chicago",
    incident_date: "2023-07-05T08:20:00",
    reporting_date: "2023-07-06T11:00:00",
    description: "Someone created fake social media profiles using my name and photos and is impersonating me online.",
    crime_type: "Identity Theft",
    extracted_text: "Profile created on Facebook under name 'Mike Johnson' using stolen photos"
  }
];

const MOCK_BLOCKCHAIN: Block[] = [
  {
    index: 0,
    timestamp: "2023-04-01T00:00:00",
    previous_hash: "0000000000000000000000000000000000000000000000000000000000000000",
    data: { message: "Genesis Block" },
    hash: "0x1d2f876c569c6b9a985f3449e4ad3510e7854573d31e711a96638291e4a3a9e1"
  },
  {
    index: 1,
    timestamp: "2023-05-16T09:30:00",
    previous_hash: "0x1d2f876c569c6b9a985f3449e4ad3510e7854573d31e711a96638291e4a3a9e1",
    data: MOCK_REPORTS[0],
    hash: "0x7a8b9c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
  },
  {
    index: 2,
    timestamp: "2023-06-20T17:00:00",
    previous_hash: "0x7a8b9c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b",
    data: MOCK_REPORTS[1],
    hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d"
  },
  {
    index: 3,
    timestamp: "2023-07-06T11:30:00",
    previous_hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
    data: MOCK_REPORTS[2],
    hash: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b"
  }
];

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      message: 'Something went wrong'
    }));
    throw new Error(errorData.message || `API Error: ${response.status}`);
  }
  return response.json();
};

// API service for reports
export const reportService = {
  // Submit a new incident report
  submitReport: async (formData: FormData): Promise<ApiResponse> => {
    try {
      console.log('Submitting report with form data:', {
        keys: Array.from(formData.keys()),
      });
      
      const response = await fetch(`${API_BASE_URL}/report`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData
      });
      
      console.log('Submit report response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from submit report API:', errorText);
        throw new Error(`API Error: ${response.status}. ${errorText}`);
      }
      
      return handleResponse(response);
    } catch (error) {
      console.error('Error in submitReport:', error);
      throw error;
    }
  },

  // Get all reports
  getReports: async (): Promise<Report[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports`);
      const data = await handleResponse(response);
      
      // If the response is empty, return mock data
      if (!data || data.length === 0) {
        console.log('No reports returned from API, using mock data');
        return MOCK_REPORTS;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      console.log('Falling back to mock data');
      return MOCK_REPORTS;
    }
  },

  // Download a report as PDF
  downloadReportPdf: async (reportId: string): Promise<Blob> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/pdf`);
      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }
      return response.blob();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
  },

  // Store a report in blockchain
  storeInBlockchain: async (reportId: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${reportId}/blockchain`, {
        method: 'POST',
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error storing in blockchain:', error);
      throw error;
    }
  },

  // Classify text using AI
  classifyCrimeType: async (description: string): Promise<ClassificationResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Error classifying crime type:', error);
      throw error;
    }
  },

  // Extract text from image
  extractTextFromImage: async (file: File): Promise<ExtractedTextResponse> => {
    // Validate the file input
    if (!file) {
      console.error('No file provided for text extraction');
      throw new Error('No file provided');
    }

    // Validate file type is an image
    if (!file.type.startsWith('image/')) {
      console.error('Invalid file type for text extraction:', file.type);
      throw new Error('Invalid file type: Only image files are supported');
    }

    const formData = new FormData();
    formData.append('file', file);
    
    // Log detailed information about the file being sent
    console.log('Sending file for text extraction:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024).toFixed(2)} KB`,
      lastModified: new Date(file.lastModified).toISOString()
    });
    
    try {
      // Make sure we send the multipart/form-data without manually setting content-type
      // (browser will set it automatically with correct boundary)
      const response = await fetch(`${API_BASE_URL}/extract-text`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Extract text response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response from extract-text API:', errorText);
        throw new Error(`API Error: ${response.status}. ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Extracted text data:', data);
      
      // Validate the response contains the expected extracted_text field
      if (!data.hasOwnProperty('extracted_text')) {
        console.error('Invalid response format:', data);
        throw new Error('Invalid response format from server');
      }
      
      return data;
    } catch (error) {
      console.error('Error in extractTextFromImage:', error);
      throw error;
    }
  },
};

// API service for blockchain
export const blockchainService = {
  // Get all blocks
  getBlocks: async (): Promise<Block[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/blockchain`);
      const data = await handleResponse(response);
      
      // If the response is empty, return mock data
      if (!data || data.length === 0) {
        console.log('No blockchain data returned from API, using mock data');
        return MOCK_BLOCKCHAIN;
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching blockchain blocks:', error);
      console.log('Falling back to mock data');
      return MOCK_BLOCKCHAIN;
    }
  },
};
