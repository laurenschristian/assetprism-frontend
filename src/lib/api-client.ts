import type { ApiError } from '@/types/api';

// API Configuration
export const API_BASE_URL = 'http://localhost:8787';
export const API_VERSION = 'v1';
export const API_URL = `${API_BASE_URL}/api/${API_VERSION}`;

// Custom error class for API errors
export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: string | string[]
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

// Generic API client function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      // Try to parse error response
      let errorData: ApiError | null = null;
      try {
        errorData = await response.json();
      } catch {
        // If JSON parsing fails, create a generic error
      }

      const errorMessage = errorData?.error?.message || 
                          `HTTP ${response.status}: ${response.statusText}`;
      const errorCode = errorData?.error?.code || 'HTTP_ERROR';
      const errorDetails = errorData?.error?.details;

      throw new ApiClientError(
        errorMessage,
        response.status,
        errorCode,
        errorDetails
      );
    }

    // Handle empty responses (e.g., 204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    
    // Network errors, parsing errors, etc.
    throw new ApiClientError(
      `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'NETWORK_ERROR'
    );
  }
}

// HTTP method helpers
export const apiClient = {
  get: <T>(endpoint: string, params?: Record<string, any>): Promise<T> => {
    let url = endpoint;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    
    return apiRequest<T>(url, { method: 'GET' });
  },

  post: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  put: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  patch: <T>(endpoint: string, data?: any): Promise<T> => {
    return apiRequest<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  },

  delete: <T>(endpoint: string): Promise<T> => {
    return apiRequest<T>(endpoint, { method: 'DELETE' });
  },
};

// Health check function
export const checkApiHealth = async (): Promise<{ status: string; timestamp: string; version: string }> => {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error(`Health check failed: ${response.statusText}`);
  }
  return response.json();
}; 