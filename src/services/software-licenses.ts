import { apiClient } from '@/lib/api-client';
import type {
  ApiResponse,
  SoftwareLicense,
  CreateSoftwareLicenseRequest,
  UpdateSoftwareLicenseRequest,
  SoftwareLicenseQueryParams,
  LicenseAssignment,
  CreateLicenseAssignmentRequest,
  SoftwarePublisher
} from '@/types/api';
import { 
  mockSoftwareLicenses, 
  mockComplianceSummary, 
  mockExpiringLicenses,
  mockSoftwarePublishers,
  mockLicenseAssignments
} from '@/data/mock-software-licenses';

// Software License CRUD Operations
export const softwareLicensesApi = {
  // Get all software licenses with pagination and filtering
  getAll: async (params?: SoftwareLicenseQueryParams): Promise<ApiResponse<SoftwareLicense[]>> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filteredLicenses = [...mockSoftwareLicenses];
    
    // Apply filters
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filteredLicenses = filteredLicenses.filter(license =>
        license.software_name.toLowerCase().includes(searchLower) ||
        license.software_publisher.toLowerCase().includes(searchLower)
      );
    }
    
    if (params?.licenseType) {
      filteredLicenses = filteredLicenses.filter(license => license.license_type === params.licenseType);
    }
    
    if (params?.licenseModel) {
      filteredLicenses = filteredLicenses.filter(license => license.license_model === params.licenseModel);
    }
    
    if (params?.complianceStatus) {
      filteredLicenses = filteredLicenses.filter(license => license.compliance_status === params.complianceStatus);
    }
    
    if (params?.isActive !== undefined) {
      filteredLicenses = filteredLicenses.filter(license => license.is_active === params.isActive);
    }
    
    // Apply sorting
    if (params?.sortBy) {
      filteredLicenses.sort((a, b) => {
        const aValue = a[params.sortBy as keyof SoftwareLicense];
        const bValue = b[params.sortBy as keyof SoftwareLicense];
        
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;
        
        const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        return params.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    // Apply pagination
    const page = params?.page || 1;
    const limit = params?.limit || 20;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLicenses = filteredLicenses.slice(startIndex, endIndex);
    
    return {
      data: paginatedLicenses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredLicenses.length / limit),
        totalItems: filteredLicenses.length,
        itemsPerPage: limit
      }
    };
  },

  // Get a single software license by ID
  getById: async (id: number): Promise<SoftwareLicense> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const license = mockSoftwareLicenses.find(l => l.id === id);
    if (!license) {
      throw new Error(`License with ID ${id} not found`);
    }
    return license;
  },

  // Create a new software license
  create: async (data: CreateSoftwareLicenseRequest): Promise<SoftwareLicense> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newLicense: SoftwareLicense = {
      id: Math.max(...mockSoftwareLicenses.map(l => l.id)) + 1,
      software_name: data.softwareName,
      software_version: data.softwareVersion || null,
      software_publisher: data.softwarePublisher,
      license_key: data.licenseKey || null,
      license_type: data.licenseType,
      license_model: data.licenseModel,
      total_seats: data.totalSeats,
      used_seats: 0,
      available_seats: data.totalSeats,
      cost_per_seat: data.costPerSeat || null,
      total_cost: data.totalCost || null,
      purchase_date: data.purchaseDate || null,
      expiration_date: data.expirationDate || null,
      maintenance_expiration_date: data.maintenanceExpirationDate || null,
      purchase_order_number: data.purchaseOrderNumber || null,
      vendor_name: data.vendorName || null,
      vendor_contact: data.vendorContact || null,
      notes: data.notes || null,
      is_active: data.isActive !== false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      compliance_status: 'compliant'
    };
    
    mockSoftwareLicenses.push(newLicense);
    return newLicense;
  },

  // Update an existing software license
  update: async (id: number, data: Partial<CreateSoftwareLicenseRequest>): Promise<SoftwareLicense> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const licenseIndex = mockSoftwareLicenses.findIndex(l => l.id === id);
    if (licenseIndex === -1) {
      throw new Error(`License with ID ${id} not found`);
    }
    
    const existingLicense = mockSoftwareLicenses[licenseIndex];
    const updatedLicense: SoftwareLicense = {
      ...existingLicense,
      software_name: data.softwareName || existingLicense.software_name,
      software_version: data.softwareVersion !== undefined ? data.softwareVersion : existingLicense.software_version,
      software_publisher: data.softwarePublisher || existingLicense.software_publisher,
      license_key: data.licenseKey !== undefined ? data.licenseKey : existingLicense.license_key,
      license_type: data.licenseType || existingLicense.license_type,
      license_model: data.licenseModel || existingLicense.license_model,
      total_seats: data.totalSeats || existingLicense.total_seats,
      cost_per_seat: data.costPerSeat !== undefined ? data.costPerSeat : existingLicense.cost_per_seat,
      total_cost: data.totalCost !== undefined ? data.totalCost : existingLicense.total_cost,
      purchase_date: data.purchaseDate !== undefined ? data.purchaseDate : existingLicense.purchase_date,
      expiration_date: data.expirationDate !== undefined ? data.expirationDate : existingLicense.expiration_date,
      maintenance_expiration_date: data.maintenanceExpirationDate !== undefined ? data.maintenanceExpirationDate : existingLicense.maintenance_expiration_date,
      purchase_order_number: data.purchaseOrderNumber !== undefined ? data.purchaseOrderNumber : existingLicense.purchase_order_number,
      vendor_name: data.vendorName !== undefined ? data.vendorName : existingLicense.vendor_name,
      vendor_contact: data.vendorContact !== undefined ? data.vendorContact : existingLicense.vendor_contact,
      notes: data.notes !== undefined ? data.notes : existingLicense.notes,
      is_active: data.isActive !== undefined ? data.isActive : existingLicense.is_active,
      updated_at: new Date().toISOString()
    };
    
    mockSoftwareLicenses[licenseIndex] = updatedLicense;
    return updatedLicense;
  },

  // Delete a software license
  delete: async (id: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const licenseIndex = mockSoftwareLicenses.findIndex(l => l.id === id);
    if (licenseIndex === -1) {
      throw new Error(`License with ID ${id} not found`);
    }
    
    mockSoftwareLicenses.splice(licenseIndex, 1);
  },

  // Get license compliance summary
  getComplianceSummary: async (): Promise<{
    total_licenses: number;
    compliant: number;
    over_deployed: number;
    expiring_soon: number;
    expired: number;
  }> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockComplianceSummary;
  },

  // Get licenses expiring within specified days
  getExpiringLicenses: async (days: number = 30): Promise<SoftwareLicense[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return mockExpiringLicenses;
  }
};

// License Assignment Operations
export const licenseAssignmentsApi = {
  // Get all assignments for a license
  getByLicenseId: async (licenseId: number): Promise<LicenseAssignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLicenseAssignments.filter(assignment => assignment.software_license_id === licenseId);
  },

  // Create a new license assignment
  create: async (data: CreateLicenseAssignmentRequest): Promise<LicenseAssignment> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newAssignment: LicenseAssignment = {
      id: Math.max(...mockLicenseAssignments.map(a => a.id)) + 1,
      software_license_id: data.softwareLicenseId,
      assigned_to_user_id: data.assignedToUserId || null,
      assigned_to_device_id: data.assignedToDeviceId || null,
      assignment_date: new Date().toISOString(),
      unassignment_date: null,
      assignment_type: data.assignmentType,
      user_name: data.assignmentType === 'user' ? 'Mock User' : undefined,
      user_email: data.assignmentType === 'user' ? 'user@company.com' : undefined,
      device_name: data.assignmentType === 'device' ? 'Mock Device' : undefined,
      device_serial: data.assignmentType === 'device' ? 'MOCK123' : undefined
    };
    
    mockLicenseAssignments.push(newAssignment);
    return newAssignment;
  },

  // Remove a license assignment (unassign)
  delete: async (assignmentId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const assignmentIndex = mockLicenseAssignments.findIndex(a => a.id === assignmentId);
    if (assignmentIndex === -1) {
      throw new Error(`Assignment with ID ${assignmentId} not found`);
    }
    
    mockLicenseAssignments.splice(assignmentIndex, 1);
  },

  // Get assignments by user
  getByUserId: async (userId: number): Promise<LicenseAssignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLicenseAssignments.filter(assignment => assignment.assigned_to_user_id === userId);
  },

  // Get assignments by device
  getByDeviceId: async (deviceId: number): Promise<LicenseAssignment[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockLicenseAssignments.filter(assignment => assignment.assigned_to_device_id === deviceId);
  }
};

// Supporting Entities for Software Licenses
export const softwarePublishersApi = {
  // Get all software publishers
  getAll: async (): Promise<SoftwarePublisher[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockSoftwarePublishers;
  },

  // Create a new software publisher
  create: async (data: { name: string; website?: string; support_contact?: string }): Promise<SoftwarePublisher> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newPublisher: SoftwarePublisher = {
      id: Math.max(...mockSoftwarePublishers.map(p => p.id)) + 1,
      name: data.name,
      website: data.website || null,
      support_contact: data.support_contact || null
    };
    
    mockSoftwarePublishers.push(newPublisher);
    return newPublisher;
  }
}; 