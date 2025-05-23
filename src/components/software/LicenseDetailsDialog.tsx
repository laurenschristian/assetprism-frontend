import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  Building, 
  FileText, 
  Key, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  Edit,
  UserPlus
} from 'lucide-react';
import { useSoftwareLicense, useLicenseAssignments } from '@/hooks/use-software-licenses';
import type { ComplianceStatus } from '@/types/api';

interface LicenseDetailsDialogProps {
  licenseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: () => void;
  onAssign?: () => void;
}

export function LicenseDetailsDialog({ 
  licenseId, 
  open, 
  onOpenChange, 
  onEdit, 
  onAssign 
}: LicenseDetailsDialogProps) {
  const { data: license, isLoading } = useSoftwareLicense(licenseId);
  const { data: assignments } = useLicenseAssignments(licenseId);

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
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateUsagePercentage = () => {
    if (!license) return 0;
    return Math.round((license.used_seats / license.total_seats) * 100);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading license details...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!license) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="text-center py-8">
            <div className="text-red-600 mb-2">License not found</div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">{license.software_name}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {license.software_publisher} • {license.software_version && `v${license.software_version}`}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              {onEdit && (
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {onAssign && (
                <Button onClick={onAssign}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Assign
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* License Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  License Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">License Type</label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {license.license_type.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">License Model</label>
                    <div className="mt-1">
                      <Badge variant="secondary">
                        {license.license_model.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>

                {license.license_key && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">License Key</label>
                    <div className="mt-1 font-mono text-sm bg-gray-50 p-2 rounded border">
                      ••••••••••••••••
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage & Compliance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usage & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{license.total_seats}</div>
                    <div className="text-sm text-gray-500">Total Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{license.used_seats}</div>
                    <div className="text-sm text-gray-500">Used Seats</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-600">{license.available_seats}</div>
                    <div className="text-sm text-gray-500">Available</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{calculateUsagePercentage()}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all ${
                        calculateUsagePercentage() > 100 ? 'bg-red-500' :
                        calculateUsagePercentage() > 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(calculateUsagePercentage(), 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Compliance Status:</span>
                  {getComplianceIcon(license.compliance_status || 'unknown')}
                  <Badge variant={getComplianceBadgeVariant(license.compliance_status || 'unknown')}>
                    {license.compliance_status?.replace('_', ' ') || 'Unknown'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Financial Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Cost</label>
                    <div className="mt-1 text-lg font-semibold">
                      {formatCurrency(license.total_cost)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Cost Per Seat</label>
                    <div className="mt-1 text-lg font-semibold">
                      {formatCurrency(license.cost_per_seat)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contract & Vendor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Contract & Vendor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor</label>
                    <div className="mt-1">{license.vendor_name || 'Not specified'}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Purchase Order</label>
                    <div className="mt-1">{license.purchase_order_number || 'Not specified'}</div>
                  </div>
                </div>
                {license.vendor_contact && (
                  <div>
                    <label className="text-sm font-medium text-gray-500">Vendor Contact</label>
                    <div className="mt-1">{license.vendor_contact}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Notes */}
            {license.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-700 whitespace-pre-wrap">
                    {license.notes}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Important Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Important Dates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Purchase Date</label>
                  <div className="mt-1">{formatDate(license.purchase_date)}</div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-gray-500">Expiration Date</label>
                  <div className="mt-1">
                    {license.expiration_date ? (
                      <span className={
                        new Date(license.expiration_date) < new Date() ? 'text-red-600 font-medium' :
                        new Date(license.expiration_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600 font-medium' :
                        'text-gray-900'
                      }>
                        {formatDate(license.expiration_date)}
                      </span>
                    ) : (
                      <span className="text-green-600 font-medium">Perpetual</span>
                    )}
                  </div>
                </div>

                {license.maintenance_expiration_date && (
                  <>
                    <Separator />
                    <div>
                      <label className="text-sm font-medium text-gray-500">Support Expiration</label>
                      <div className="mt-1">
                        <span className={
                          new Date(license.maintenance_expiration_date) < new Date() ? 'text-red-600 font-medium' :
                          new Date(license.maintenance_expiration_date) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-orange-600 font-medium' :
                          'text-gray-900'
                        }>
                          {formatDate(license.maintenance_expiration_date)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* License Assignments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Assignments
                  </span>
                  <Badge variant="outline">{assignments?.length || 0}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {assignments && assignments.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {assignments.slice(0, 10).map((assignment) => (
                      <div key={assignment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">
                            {assignment.user_name || assignment.device_name || 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {assignment.assignment_type === 'user' ? 'User' : 'Device'} • 
                            {new Date(assignment.assignment_date).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                    {assignments.length > 10 && (
                      <div className="text-center text-sm text-gray-500 pt-2">
                        +{assignments.length - 10} more assignments
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No assignments yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {onEdit && (
                  <Button variant="outline" className="w-full" onClick={onEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit License
                  </Button>
                )}
                {onAssign && (
                  <Button variant="outline" className="w-full" onClick={onAssign}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Assign Seats
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 