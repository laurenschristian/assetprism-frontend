import { QueryClient, MutationCache, QueryCache } from '@tanstack/react-query';
import { ApiClientError } from './api-client';

// Create a custom error handler for queries and mutations
const handleError = (error: unknown) => {
  if (error instanceof ApiClientError) {
    console.error('API Error:', error.message, {
      status: error.status,
      code: error.code,
      details: error.details,
    });
  } else {
    console.error('Unknown error:', error);
  }
};

// Create React Query client with custom configuration
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleError,
  }),
  mutationCache: new MutationCache({
    onError: handleError,
  }),
  defaultOptions: {
    queries: {
      // Refetch on window focus for real-time data
      refetchOnWindowFocus: true,
      // Retry failed requests up to 3 times
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      // Retry failed mutations up to 2 times
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors (client errors)
        if (error instanceof ApiClientError && error.status >= 400 && error.status < 500) {
          return false;
        }
        return failureCount < 2;
      },
    },
  },
});

// Query keys factory for consistent key management
export const queryKeys = {
  // Hardware Assets
  hardwareAssets: {
    all: ['hardware-assets'] as const,
    lists: () => [...queryKeys.hardwareAssets.all, 'list'] as const,
    list: (params?: Record<string, any>) => 
      [...queryKeys.hardwareAssets.lists(), params] as const,
    details: () => [...queryKeys.hardwareAssets.all, 'detail'] as const,
    detail: (id: number) => [...queryKeys.hardwareAssets.details(), id] as const,
  },
  
  // Supporting entities
  users: {
    all: ['users'] as const,
  },
  locations: {
    all: ['locations'] as const,
  },
  manufacturers: {
    all: ['manufacturers'] as const,
  },
  assetCategories: {
    all: ['asset-categories'] as const,
  },
  
  // Health check
  health: ['health'] as const,
} as const; 