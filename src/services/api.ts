
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
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching reports:', error);
      throw error;
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
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching blockchain blocks:', error);
      throw error;
    }
  },
};
