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
import { 
  Calendar,
  DollarSign,
  HardDrive,
  Info,
  MapPin,
  User,
  Wrench,
  FileText,
  Edit,
  Trash2
} from 'lucide-react';
import { useHardwareAsset, useDeleteHardwareAsset } from '@/hooks/use-hardware-assets';
import type { AssetStatus } from '@/types/api';

interface AssetDetailsDialogProps {
  assetId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetailsDialog({ assetId, open, onOpenChange }: AssetDetailsDialogProps) {
  const { data: asset, isLoading, error } = useHardwareAsset(assetId);
  const deleteAssetMutation = useDeleteHardwareAsset();

  const getStatusBadgeVariant = (status: AssetStatus) => {
    switch (status) {
      case 'deployed': return 'default';
      case 'in_stock': return 'secondary';
      case 'in_repair': return 'destructive';
      case 'retired': return 'outline';
      case 'disposed': return 'outline';
      default: return 'outline';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number | null) => {
    if (!amount) return 'Not set';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this asset? This action cannot be undone.')) {
      try {
        await deleteAssetMutation.mutateAsync(assetId);
        onOpenChange(false);
      } catch (error) {
        console.error('Failed to delete asset:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p>Loading asset details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !asset) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load asset details</p>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <HardDrive className="h-5 w-5" />
                {asset.model_name}
              </DialogTitle>
              <DialogDescription>
                Serial Number: {asset.serial_number}
                {asset.asset_tag && ` • Asset Tag: ${asset.asset_tag}`}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusBadgeVariant(asset.status)}>
                {asset.status.replace('_', ' ')}
              </Badge>
              <div className="flex gap-1">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDelete}
                  disabled={deleteAssetMutation.isPending}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Manufacturer</p>
                  <p className="text-sm">{asset.manufacturer_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Model</p>
                  <p className="text-sm">{asset.model_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Category</p>
                  <p className="text-sm">{asset.category_name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Model Number</p>
                  <p className="text-sm">{asset.model_number || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Serial Number</p>
                  <p className="text-sm font-mono">{asset.serial_number}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Asset Tag</p>
                  <p className="text-sm">{asset.asset_tag || 'Not assigned'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Purchase Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Purchase Date</p>
                  <p className="text-sm">{formatDate(asset.purchase_date)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Purchase Cost</p>
                  <p className="text-sm">{formatCurrency(asset.purchase_cost)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">PO Number</p>
                  <p className="text-sm">{asset.po_number || 'Not specified'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warranty Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-4 w-4" />
                Warranty Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Warranty Expiration</p>
                <p className="text-sm">{formatDate(asset.warranty_expiration_date)}</p>
                {asset.warranty_expiration_date && (
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(asset.warranty_expiration_date) > new Date() 
                      ? 'Warranty is active' 
                      : 'Warranty has expired'}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Assignment Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Assignment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {asset.assignments && asset.assignments.length > 0 ? (
                <div className="space-y-2">
                  {asset.assignments.map((assignment, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">
                            {assignment.user_name || 'Unassigned'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {assignment.location_name || 'No location'}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assignment.assignment_type || 'Standard'}
                        </Badge>
                      </div>
                      {assignment.assigned_date && (
                        <p className="text-xs text-gray-400 mt-1">
                          Assigned: {formatDate(assignment.assigned_date)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Not currently assigned</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium">Asset Created</p>
                    <p className="text-xs text-gray-500">{formatDate(asset.created_at)}</p>
                  </div>
                </div>
                
                {asset.updated_at && asset.updated_at !== asset.created_at && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(asset.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {asset.notes && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap">{asset.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 