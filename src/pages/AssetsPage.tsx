import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  HardDrive, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import { useHardwareAssets, useDeleteHardwareAsset } from '@/hooks/use-hardware-assets';
import type { HardwareAssetQueryParams, AssetStatus } from '@/types/api';
import { CreateAssetDialog } from '@/components/assets/CreateAssetDialog';
import { EditAssetDialog } from '@/components/assets/EditAssetDialog';
import { AssetDetailsDialog } from '@/components/assets/AssetDetailsDialog';

export function AssetsPage() {
  const [queryParams, setQueryParams] = useState<HardwareAssetQueryParams>({
    page: 1,
    limit: 25,
    sortBy: 'created_at',
    sortOrder: 'desc'
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAssetId, setSelectedAssetId] = useState<number | null>(null);
  const [dialogState, setDialogState] = useState<{
    create: boolean;
    edit: boolean;
    details: boolean;
  }>({
    create: false,
    edit: false,
    details: false
  });

  const { data: assetsData, isLoading, error, refetch } = useHardwareAssets(queryParams);
  const deleteAssetMutation = useDeleteHardwareAsset();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    // In a real implementation, you'd debounce this and add search to API
    // For now, we'll just store the search term
  };

  const handleStatusFilter = (status: AssetStatus | 'all') => {
    setQueryParams(prev => ({
      ...prev,
      status: status === 'all' ? undefined : status,
      page: 1
    }));
  };

  const handleSort = (sortBy: string) => {
    setQueryParams(prev => ({
      ...prev,
      sortBy: sortBy as any,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
      page: 1
    }));
  };

  const handlePageChange = (page: number) => {
    setQueryParams(prev => ({ ...prev, page }));
  };

  const handleDeleteAsset = async (assetId: number) => {
    if (window.confirm('Are you sure you want to delete this asset?')) {
      try {
        await deleteAssetMutation.mutateAsync(assetId);
      } catch (error) {
        console.error('Failed to delete asset:', error);
      }
    }
  };

  const openDialog = (type: 'create' | 'edit' | 'details', assetId?: number) => {
    if (assetId) setSelectedAssetId(assetId);
    setDialogState(prev => ({ ...prev, [type]: true }));
  };

  const closeDialog = (type: 'create' | 'edit' | 'details') => {
    setDialogState(prev => ({ ...prev, [type]: false }));
    setSelectedAssetId(null);
  };

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hardware Assets</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your organization's hardware inventory
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => openDialog('create')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Asset
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search assets by serial number, model, or tag..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="deployed">Deployed</SelectItem>
                  <SelectItem value="in_repair">In Repair</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="disposed">Disposed</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setQueryParams(prev => ({ ...prev, limit: parseInt(value), page: 1 }))}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="25 per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10 per page</SelectItem>
                  <SelectItem value="25">25 per page</SelectItem>
                  <SelectItem value="50">50 per page</SelectItem>
                  <SelectItem value="100">100 per page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Assets ({assetsData?.pagination?.totalItems || 0})
          </CardTitle>
          <CardDescription>
            {isLoading ? 'Loading assets...' : 
             error ? 'Failed to load assets' :
             `Showing ${assetsData?.data?.length || 0} of ${assetsData?.pagination?.totalItems || 0} assets`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mr-2" />
              Loading assets...
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <div className="text-red-600 mb-2">Failed to load assets</div>
              <Button variant="outline" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          ) : assetsData?.data && assetsData.data.length > 0 ? (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('asset_tag')}
                      >
                        Asset Tag
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('serial_number')}
                      >
                        Serial Number
                      </TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('status')}
                      >
                        Status
                      </TableHead>
                      <TableHead 
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => handleSort('created_at')}
                      >
                        Added
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assetsData.data.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">
                          {asset.asset_tag || 'N/A'}
                        </TableCell>
                        <TableCell>{asset.serial_number}</TableCell>
                        <TableCell>{asset.model_name}</TableCell>
                        <TableCell>{asset.manufacturer_name}</TableCell>
                        <TableCell>{asset.category_name}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(asset.status)}>
                            {asset.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(asset.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDialog('details', asset.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDialog('edit', asset.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAsset(asset.id)}
                              disabled={deleteAssetMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {assetsData.pagination && assetsData.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-500">
                    Page {assetsData.pagination.currentPage} of {assetsData.pagination.totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(assetsData.pagination!.currentPage - 1)}
                      disabled={assetsData.pagination.currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(assetsData.pagination!.currentPage + 1)}
                      disabled={assetsData.pagination.currentPage === assetsData.pagination.totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <HardDrive className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No assets found
              </h3>
              <p className="text-gray-500 mb-4">
                Get started by adding your first hardware asset.
              </p>
              <Button onClick={() => openDialog('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Asset
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <CreateAssetDialog 
        open={dialogState.create}
        onOpenChange={(open: boolean) => !open && closeDialog('create')}
      />
      
      {selectedAssetId && (
        <>
          <EditAssetDialog 
            assetId={selectedAssetId}
            open={dialogState.edit}
            onOpenChange={(open: boolean) => !open && closeDialog('edit')}
          />
          <AssetDetailsDialog 
            assetId={selectedAssetId}
            open={dialogState.details}
            onOpenChange={(open: boolean) => !open && closeDialog('details')}
          />
        </>
      )}
    </div>
  );
} 