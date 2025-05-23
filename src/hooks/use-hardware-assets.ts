import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hardwareAssetsApi, supportingEntitiesApi } from '@/services/hardware-assets';
import { queryKeys } from '@/lib/react-query';
import type {
  HardwareAssetQueryParams,
  CreateHardwareAssetRequest,
  HardwareAsset,
} from '@/types/api';

// Hook to get paginated hardware assets
export const useHardwareAssets = (params?: HardwareAssetQueryParams) => {
  return useQuery({
    queryKey: queryKeys.hardwareAssets.list(params),
    queryFn: () => hardwareAssetsApi.getAll(params),
    enabled: true, // Always enabled since we want to fetch on mount
  });
};

// Hook to get a single hardware asset by ID
export const useHardwareAsset = (id: number) => {
  return useQuery({
    queryKey: queryKeys.hardwareAssets.detail(id),
    queryFn: () => hardwareAssetsApi.getById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
};

// Hook to create a new hardware asset
export const useCreateHardwareAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateHardwareAssetRequest) => hardwareAssetsApi.create(data),
    onSuccess: (newAsset) => {
      // Invalidate and refetch hardware assets list
      queryClient.invalidateQueries({
        queryKey: queryKeys.hardwareAssets.lists(),
      });

      // Optionally add the new asset to the cache
      queryClient.setQueryData(
        queryKeys.hardwareAssets.detail(newAsset.id),
        newAsset
      );
    },
  });
};

// Hook to update a hardware asset
export const useUpdateHardwareAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateHardwareAssetRequest> }) =>
      hardwareAssetsApi.update(id, data),
    onSuccess: (updatedAsset) => {
      // Update the asset in the cache
      queryClient.setQueryData(
        queryKeys.hardwareAssets.detail(updatedAsset.id),
        updatedAsset
      );

      // Invalidate lists to ensure they reflect the update
      queryClient.invalidateQueries({
        queryKey: queryKeys.hardwareAssets.lists(),
      });
    },
  });
};

// Hook to delete a hardware asset
export const useDeleteHardwareAsset = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => hardwareAssetsApi.delete(id),
    onSuccess: (_, deletedId) => {
      // Remove the asset from cache
      queryClient.removeQueries({
        queryKey: queryKeys.hardwareAssets.detail(deletedId),
      });

      // Invalidate lists to ensure they reflect the deletion
      queryClient.invalidateQueries({
        queryKey: queryKeys.hardwareAssets.lists(),
      });
    },
  });
};

// Supporting entities hooks
export const useUsers = () => {
  return useQuery({
    queryKey: queryKeys.users.all,
    queryFn: () => supportingEntitiesApi.getUsers(),
    staleTime: 10 * 60 * 1000, // Users don't change often, cache for 10 minutes
  });
};

export const useLocations = () => {
  return useQuery({
    queryKey: queryKeys.locations.all,
    queryFn: () => supportingEntitiesApi.getLocations(),
    staleTime: 10 * 60 * 1000, // Locations don't change often
  });
};

export const useManufacturers = () => {
  return useQuery({
    queryKey: queryKeys.manufacturers.all,
    queryFn: () => supportingEntitiesApi.getManufacturers(),
    staleTime: 15 * 60 * 1000, // Manufacturers change rarely
  });
};

export const useAssetCategories = () => {
  return useQuery({
    queryKey: queryKeys.assetCategories.all,
    queryFn: () => supportingEntitiesApi.getAssetCategories(),
    staleTime: 15 * 60 * 1000, // Categories change rarely
  });
}; 