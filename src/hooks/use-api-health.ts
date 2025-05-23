import { useQuery } from '@tanstack/react-query';
import { checkApiHealth } from '@/lib/api-client';
import { queryKeys } from '@/lib/react-query';

export const useApiHealth = () => {
  return useQuery({
    queryKey: queryKeys.health,
    queryFn: checkApiHealth,
    refetchInterval: 30000, // Check health every 30 seconds
    retry: 1, // Only retry once for health checks
    staleTime: 0, // Always treat health data as stale to get fresh status
  });
};

// Hook for a one-time health check (useful for testing connectivity)
export const useApiHealthCheck = () => {
  return useQuery({
    queryKey: [...queryKeys.health, 'check'],
    queryFn: checkApiHealth,
    enabled: false, // Manual trigger only
    retry: 1,
  });
}; 