// API Response Types
export interface ApiResponse<T> {
  data: T;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Hardware Asset Types
export interface HardwareAsset {
  id: number;
  asset_tag: string | null;
  serial_number: string;
  status: AssetStatus;
  purchase_date: string | null;
  purchase_cost: number | null;
  warranty_expiration_date: string | null;
  notes: string | null;
  mac_addresses: string | null;
  po_number: string | null;
  created_at: string;
  updated_at: string;
  
  // Related data from joins
  model_name: string;
  model_number: string | null;
  manufacturer_name: string;
  category_name: string;
  vendor_name?: string;
  vendor_contact?: string;
  vendor_email?: string;
  specifications?: string;
  
  // Current assignment info
  current_assignment?: AssetAssignment;
  
  // Assignment history
  assignments?: AssetAssignment[];
}

export interface AssetAssignment {
  id: number;
  hardware_asset_id: number;
  assigned_to_user_id: number;
  location_id: number;
  assignment_date: string;
  assigned_date?: string; // Alternative field name
  unassignment_date: string | null;
  assigned_user_name?: string;
  user_name?: string; // Alternative field name
  assigned_user_email?: string;
  location_name?: string;
  assignment_type?: string;
}

export type AssetStatus = 
  | 'in_stock' 
  | 'deployed' 
  | 'in_repair' 
  | 'retired' 
  | 'disposed';

// Asset Creation Types
export interface CreateHardwareAssetRequest {
  make: string;
  model: string;
  serialNumber: string;
  assetTag?: string;
  assetType: string;
  cpu?: string;
  ram?: string;
  storage?: string;
  macAddresses?: string[];
  purchaseDate?: string;
  purchaseCost?: number;
  poNumber?: string;
  vendorId?: number;
  warrantyExpirationDate?: string;
  initialStatus?: AssetStatus;
  modelNumber?: string;
  notes?: string;
}

// Software License Management Types
export interface SoftwareLicense {
  id: number;
  software_name: string;
  software_version: string | null;
  software_publisher: string;
  license_key: string | null;
  license_type: LicenseType;
  license_model: LicenseModel;
  total_seats: number;
  used_seats: number;
  available_seats: number;
  cost_per_seat: number | null;
  total_cost: number | null;
  purchase_date: string | null;
  expiration_date: string | null;
  maintenance_expiration_date: string | null;
  purchase_order_number: string | null;
  vendor_name: string | null;
  vendor_contact: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Related data
  assignments?: LicenseAssignment[];
  compliance_status?: ComplianceStatus;
}

export interface LicenseAssignment {
  id: number;
  software_license_id: number;
  assigned_to_user_id: number | null;
  assigned_to_device_id: number | null;
  assignment_date: string;
  unassignment_date: string | null;
  assignment_type: LicenseAssignmentType;
  
  // Related data from joins
  user_name?: string;
  user_email?: string;
  device_name?: string;
  device_serial?: string;
}

export type LicenseType = 
  | 'perpetual'
  | 'subscription' 
  | 'volume'
  | 'oem'
  | 'trial'
  | 'educational'
  | 'enterprise_agreement';

export type LicenseModel = 
  | 'per_user'
  | 'per_device' 
  | 'per_core'
  | 'per_processor'
  | 'concurrent'
  | 'named_user'
  | 'site_license'
  | 'enterprise';

export type LicenseAssignmentType = 
  | 'user'
  | 'device'
  | 'shared';

export type ComplianceStatus = 
  | 'compliant'
  | 'over_deployed'
  | 'under_utilized'
  | 'expired'
  | 'expiring_soon'
  | 'unknown';

export interface CreateSoftwareLicenseRequest {
  softwareName: string;
  softwareVersion?: string;
  softwarePublisher: string;
  licenseKey?: string;
  licenseType: LicenseType;
  licenseModel: LicenseModel;
  totalSeats: number;
  costPerSeat?: number;
  totalCost?: number;
  purchaseDate?: string;
  expirationDate?: string;
  maintenanceExpirationDate?: string;
  purchaseOrderNumber?: string;
  vendorName?: string;
  vendorContact?: string;
  notes?: string;
  isActive?: boolean;
}

export interface UpdateSoftwareLicenseRequest extends Partial<CreateSoftwareLicenseRequest> {
  id: number;
}

export interface CreateLicenseAssignmentRequest {
  softwareLicenseId: number;
  assignedToUserId?: number;
  assignedToDeviceId?: number;
  assignmentType: LicenseAssignmentType;
}

// Software License Query Parameters
export interface SoftwareLicenseQueryParams {
  page?: number;
  limit?: number;
  licenseType?: LicenseType;
  licenseModel?: LicenseModel;
  complianceStatus?: ComplianceStatus;
  isActive?: boolean;
  expiringWithinDays?: number;
  sortBy?: 'software_name' | 'expiration_date' | 'created_at' | 'total_seats' | 'used_seats';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Supporting Entity Types
export interface User {
  id: number;
  employee_id: string | null;
  full_name: string;
  email: string;
  department_id: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  
  // Asset/License assignments
  hardware_assignments?: AssetAssignment[];
  license_assignments?: LicenseAssignment[];
}

export interface Location {
  id: number;
  name: string;
  address_line1: string | null;
  city: string | null;
  state_province: string | null;
  country: string | null;
}

export interface Manufacturer {
  id: number;
  name: string;
}

export interface AssetCategory {
  id: number;
  name: string;
}

export interface SoftwarePublisher {
  id: number;
  name: string;
  website: string | null;
  support_contact: string | null;
}

// API Query Parameters
export interface HardwareAssetQueryParams {
  page?: number;
  limit?: number;
  status?: AssetStatus;
  assetType?: string;
  sortBy?: 'created_at' | 'updated_at' | 'purchase_date' | 'status' | 'serial_number' | 'asset_tag';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface UserQueryParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  departmentId?: number;
  sortBy?: 'full_name' | 'email' | 'created_at' | 'employee_id';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Error Types
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: string | string[];
  };
} 