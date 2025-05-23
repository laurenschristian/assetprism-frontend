import React, { useState } from 'react';
import { Plus, Search, Filter, Download, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSoftwareLicenses, useLicenseComplianceSummary, useExpiringLicenses } from '@/hooks/use-software-licenses';
import { CreateLicenseDialog } from '@/components/software/CreateLicenseDialog';
import { EditLicenseDialog } from '@/components/software/EditLicenseDialog';
import { LicenseDetailsDialog } from '@/components/software/LicenseDetailsDialog';
import { AssignLicenseDialog } from '@/components/software/AssignLicenseDialog';
import type { SoftwareLicenseQueryParams, LicenseType, LicenseModel, ComplianceStatus } from '@/types/api';

export function SoftwareLicensesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedLicenseId, setSelectedLicenseId] = useState<number | null>(null);
  const [filters, setFilters] = useState<SoftwareLicenseQueryParams>({
    page: 1,
    limit: 20,
    sortBy: 'software_name',
    sortOrder: 'asc'
  });

  // Queries
  const { data: licensesResponse, isLoading: licensesLoading } = useSoftwareLicenses(filters);
  const { data: complianceSummary } = useLicenseComplianceSummary();
  const { data: expiringLicenses } = useExpiringLicenses(30);

  const licenses = licensesResponse?.data || [];
  const pagination = licensesResponse?.pagination;

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: keyof SoftwareLicenseQueryParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleViewLicense = (licenseId: number) => {
    setSelectedLicenseId(licenseId);
    setDetailsDialogOpen(true);
  };

  const handleEditLicense = (licenseId: number) => {
    setSelectedLicenseId(licenseId);
    setEditDialogOpen(true);
  };

  const handleAssignLicense = (licenseId: number) => {
    setSelectedLicenseId(licenseId);
    setAssignDialogOpen(true);
  };

  const getComplianceIcon = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'over_deployed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'under_utilized':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'expiring_soon':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getComplianceBadgeVariant = (status: ComplianceStatus) => {
    switch (status) {
      case 'compliant':
        return 'default';
      case 'over_deployed':
      case 'expired':
        return 'destructive';
      case 'under_utilized':
      case 'expiring_soon':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Software Licenses</h1>
          <p className="text-gray-600">
            Manage software licenses, track compliance, and monitor usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add License
          </Button>
        </div>
      </div>

      {/* Compliance Summary Cards */}
      {complianceSummary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{complianceSummary.total_licenses}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Compliant</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{complianceSummary.compliant}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Over-deployed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{complianceSummary.over_deployed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{complianceSummary.expiring_soon}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Expired</CardTitle>
              <XCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{complianceSummary.expired}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Licenses</TabsTrigger>
          <TabsTrigger value="expiring">Expiring Soon</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Issues</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search licenses..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filters.licenseType || 'all'} onValueChange={(value) => handleFilterChange('licenseType', value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="License Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="perpetual">Perpetual</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
                <SelectItem value="volume">Volume</SelectItem>
                <SelectItem value="oem">OEM</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="educational">Educational</SelectItem>
                <SelectItem value="enterprise_agreement">Enterprise Agreement</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.licenseModel || 'all'} onValueChange={(value) => handleFilterChange('licenseModel', value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="License Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="per_user">Per User</SelectItem>
                <SelectItem value="per_device">Per Device</SelectItem>
                <SelectItem value="per_core">Per Core</SelectItem>
                <SelectItem value="per_processor">Per Processor</SelectItem>
                <SelectItem value="concurrent">Concurrent</SelectItem>
                <SelectItem value="named_user">Named User</SelectItem>
                <SelectItem value="site_license">Site License</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>

          {/* Licenses Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Software</TableHead>
                  <TableHead>Publisher</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Seats</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Expiration</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {licensesLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Loading licenses...
                    </TableCell>
                  </TableRow>
                ) : licenses.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      No licenses found
                    </TableCell>
                  </TableRow>
                ) : (
                  licenses.map((license) => (
                    <TableRow key={license.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{license.software_name}</div>
                          {license.software_version && (
                            <div className="text-sm text-gray-500">v{license.software_version}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{license.software_publisher}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {license.license_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {license.license_model.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{license.total_seats}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span>{license.used_seats}/{license.total_seats}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(license.used_seats / license.total_seats) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(license.total_cost)}</TableCell>
                      <TableCell>{formatDate(license.expiration_date)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getComplianceIcon(license.compliance_status || 'unknown')}
                          <Badge variant={getComplianceBadgeVariant(license.compliance_status || 'unknown')}>
                            {license.compliance_status?.replace('_', ' ') || 'Unknown'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleViewLicense(license.id)}>View</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleEditLicense(license.id)}>Edit</Button>
                          <Button variant="ghost" size="sm" onClick={() => handleAssignLicense(license.id)}>Assign</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{' '}
                {pagination.totalItems} licenses
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={pagination.currentPage === 1}
                  onClick={() => handleFilterChange('page', pagination.currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={pagination.currentPage === pagination.totalPages}
                  onClick={() => handleFilterChange('page', pagination.currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="expiring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Licenses Expiring in Next 30 Days</CardTitle>
              <CardDescription>
                Review and renew these licenses to maintain compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {expiringLicenses && expiringLicenses.length > 0 ? (
                <div className="space-y-4">
                  {expiringLicenses.map((license) => (
                    <div key={license.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{license.software_name}</div>
                        <div className="text-sm text-gray-500">
                          Expires: {formatDate(license.expiration_date)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{license.total_seats} seats</Badge>
                        <Button size="sm">Renew</Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No licenses expiring in the next 30 days
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Issues</CardTitle>
              <CardDescription>
                Licenses requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Compliance monitoring will be implemented with real data
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create License Dialog */}
      <CreateLicenseDialog 
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      {/* Edit License Dialog */}
      {selectedLicenseId && (
        <EditLicenseDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          licenseId={selectedLicenseId}
        />
      )}

      {/* License Details Dialog */}
      {selectedLicenseId && (
        <LicenseDetailsDialog 
          open={detailsDialogOpen}
          onOpenChange={setDetailsDialogOpen}
          licenseId={selectedLicenseId}
          onEdit={() => {
            setDetailsDialogOpen(false);
            setEditDialogOpen(true);
          }}
          onAssign={() => handleAssignLicense(selectedLicenseId)}
        />
      )}

      {/* Assign License Dialog */}
      {selectedLicenseId && (
        <AssignLicenseDialog 
          open={assignDialogOpen}
          onOpenChange={setAssignDialogOpen}
          licenseId={selectedLicenseId}
        />
      )}
    </div>
  );
} 