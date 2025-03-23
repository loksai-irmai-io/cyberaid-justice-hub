
import { Report, Block, ApiResponse, ClassificationResponse, ExtractedTextResponse } from '@/types';

// Base URL for the API - replace with your actual backend URL when deployed
const API_BASE_URL = 'http://localhost:8000';

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
    const response = await fetch(`${API_BASE_URL}/report`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  // Get all reports
  getReports: async (): Promise<Report[]> => {
    const response = await fetch(`${API_BASE_URL}/reports`);
    return handleResponse(response);
  },

  // Download a report as PDF
  downloadReportPdf: async (reportId: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/pdf`);
    if (!response.ok) {
      throw new Error('Failed to download PDF');
    }
    return response.blob();
  },

  // Store a report in blockchain
  storeInBlockchain: async (reportId: string): Promise<ApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/blockchain`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  // Classify text using AI
  classifyCrimeType: async (description: string): Promise<ClassificationResponse> => {
    const response = await fetch(`${API_BASE_URL}/classify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description }),
    });
    return handleResponse(response);
  },

  // Extract text from image
  extractTextFromImage: async (file: File): Promise<ExtractedTextResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Sending file for text extraction:', file.name, file.type, file.size);
    
    try {
      const response = await fetch(`${API_BASE_URL}/extract-text`, {
        method: 'POST',
        body: formData,
      });
      
      console.log('Extract text response status:', response.status);
      
      if (!response.ok) {
        console.error('Error response:', await response.text());
        throw new Error(`API Error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Extracted text data:', data);
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
    const response = await fetch(`${API_BASE_URL}/blockchain`);
    return handleResponse(response);
  },
};
