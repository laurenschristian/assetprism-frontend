import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  HardwareAsset,
  HardwareAssetQueryParams,
  CreateHardwareAssetRequest,
  User,
  Location,
  Manufacturer,
  AssetCategory,
} from '@/types/api';

// Hardware Assets API
export const hardwareAssetsApi = {
  // Get paginated list of hardware assets
  getAll: (params?: HardwareAssetQueryParams): Promise<ApiResponse<HardwareAsset[]>> => {
    return apiClient.get('/hardware-assets', params);
  },

  // Get a single hardware asset by ID
  getById: (id: number): Promise<HardwareAsset> => {
    return apiClient.get(`/hardware-assets/${id}`);
  },

  // Create a new hardware asset
  create: (data: CreateHardwareAssetRequest): Promise<HardwareAsset> => {
    return apiClient.post('/hardware-assets', data);
  },

  // Update a hardware asset
  update: (id: number, data: Partial<CreateHardwareAssetRequest>): Promise<HardwareAsset> => {
    return apiClient.put(`/hardware-assets/${id}`, data);
  },

  // Delete a hardware asset
  delete: (id: number): Promise<void> => {
    return apiClient.delete(`/hardware-assets/${id}`);
  },
};

// Supporting entities API
export const supportingEntitiesApi = {
  // Users
  getUsers: (): Promise<User[]> => {
    return apiClient.get('/users');
  },

  // Locations
  getLocations: (): Promise<Location[]> => {
    return apiClient.get('/locations');
  },

  // Manufacturers
  getManufacturers: (): Promise<Manufacturer[]> => {
    return apiClient.get('/manufacturers');
  },

  // Asset Categories
  getAssetCategories: (): Promise<AssetCategory[]> => {
    return apiClient.get('/asset-categories');
  },
}; 