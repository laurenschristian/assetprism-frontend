import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  softwareLicensesApi, 
  licenseAssignmentsApi, 
  softwarePublishersApi 
} from '@/services/software-licenses';
import type {
  SoftwareLicense,
  CreateSoftwareLicenseRequest,
  SoftwareLicenseQueryParams,
  LicenseAssignment,
  CreateLicenseAssignmentRequest,
  SoftwarePublisher
} from '@/types/api';

// Query Keys Factory
export const softwareLicenseKeys = {
  all: ['software-licenses'] as const,
  lists: () => [...softwareLicenseKeys.all, 'list'] as const,
  list: (params?: SoftwareLicenseQueryParams) => [...softwareLicenseKeys.lists(), params] as const,
  details: () => [...softwareLicenseKeys.all, 'detail'] as const,
  detail: (id: number) => [...softwareLicenseKeys.details(), id] as const,
  compliance: () => [...softwareLicenseKeys.all, 'compliance'] as const,
  expiring: (days?: number) => [...softwareLicenseKeys.all, 'expiring', days] as const,
  assignments: (licenseId: number) => [...softwareLicenseKeys.all, 'assignments', licenseId] as const,
  publishers: ['software-publishers'] as const,
};

// Software License Hooks
export function useSoftwareLicenses(params?: SoftwareLicenseQueryParams) {
  return useQuery({
    queryKey: softwareLicenseKeys.list(params),
    queryFn: () => softwareLicensesApi.getAll(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSoftwareLicense(id: number) {
  return useQuery({
    queryKey: softwareLicenseKeys.detail(id),
    queryFn: () => softwareLicensesApi.getById(id),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateSoftwareLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSoftwareLicenseRequest) => softwareLicensesApi.create(data),
    onSuccess: () => {
      // Invalidate and refetch license lists
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.compliance() });
    },
  });
}

export function useUpdateSoftwareLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSoftwareLicenseRequest> }) =>
      softwareLicensesApi.update(id, data),
    onSuccess: (updatedLicense) => {
      // Update the specific license in cache
      queryClient.setQueryData(
        softwareLicenseKeys.detail(updatedLicense.id),
        updatedLicense
      );
      
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.compliance() });
    },
  });
}

export function useDeleteSoftwareLicense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => softwareLicensesApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: softwareLicenseKeys.detail(deletedId) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.lists() });
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.compliance() });
    },
  });
}

// Compliance and Analytics Hooks
export function useLicenseComplianceSummary() {
  return useQuery({
    queryKey: softwareLicenseKeys.compliance(),
    queryFn: () => softwareLicensesApi.getComplianceSummary(),
    staleTime: 2 * 60 * 1000, // 2 minutes for compliance data
  });
}

export function useExpiringLicenses(days: number = 30) {
  return useQuery({
    queryKey: softwareLicenseKeys.expiring(days),
    queryFn: () => softwareLicensesApi.getExpiringLicenses(days),
    staleTime: 5 * 60 * 1000,
  });
}

// License Assignment Hooks
export function useLicenseAssignments(licenseId: number) {
  return useQuery({
    queryKey: softwareLicenseKeys.assignments(licenseId),
    queryFn: () => licenseAssignmentsApi.getByLicenseId(licenseId),
    staleTime: 2 * 60 * 1000,
  });
}

export function useCreateLicenseAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLicenseAssignmentRequest) => licenseAssignmentsApi.create(data),
    onSuccess: (newAssignment) => {
      // Invalidate assignments for the specific license
      queryClient.invalidateQueries({ 
        queryKey: softwareLicenseKeys.assignments(newAssignment.software_license_id) 
      });
      
      // Invalidate license details to update seat counts
      queryClient.invalidateQueries({ 
        queryKey: softwareLicenseKeys.detail(newAssignment.software_license_id) 
      });
      
      // Invalidate compliance data
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.compliance() });
    },
  });
}

export function useDeleteLicenseAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: number) => licenseAssignmentsApi.delete(assignmentId),
    onMutate: async (assignmentId) => {
      // Optimistically remove assignment from cache
      // Note: In a real implementation, you'd need to know the license ID
      // This is a simplified version
      return { assignmentId };
    },
    onSuccess: () => {
      // Invalidate all assignment queries and compliance data
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.all });
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.compliance() });
    },
  });
}

// Supporting Entity Hooks
export function useSoftwarePublishers() {
  return useQuery({
    queryKey: softwareLicenseKeys.publishers,
    queryFn: () => softwarePublishersApi.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - publishers don't change often
  });
}

export function useCreateSoftwarePublisher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; website?: string; support_contact?: string }) =>
      softwarePublishersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: softwareLicenseKeys.publishers });
    },
  });
} 