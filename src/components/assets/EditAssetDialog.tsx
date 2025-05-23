import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useHardwareAsset, useUpdateHardwareAsset } from '@/hooks/use-hardware-assets';
import type { CreateHardwareAssetRequest, AssetStatus } from '@/types/api';

interface EditAssetDialogProps {
  assetId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAssetDialog({ assetId, open, onOpenChange }: EditAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: asset, isLoading } = useHardwareAsset(assetId);
  const updateAssetMutation = useUpdateHardwareAsset();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm<CreateHardwareAssetRequest>();

  // Populate form when asset data loads
  useEffect(() => {
    if (asset) {
      setValue('make', asset.manufacturer_name);
      setValue('model', asset.model_name);
      setValue('serialNumber', asset.serial_number);
      setValue('assetTag', asset.asset_tag || '');
      setValue('modelNumber', asset.model_number || '');
      setValue('notes', asset.notes || '');
      setValue('initialStatus', asset.status);
      
      if (asset.purchase_date) {
        setValue('purchaseDate', asset.purchase_date.split('T')[0]);
      }
      if (asset.purchase_cost) {
        setValue('purchaseCost', asset.purchase_cost);
      }
      if (asset.warranty_expiration_date) {
        setValue('warrantyExpirationDate', asset.warranty_expiration_date.split('T')[0]);
      }
    }
  }, [asset, setValue]);

  const onSubmit = async (data: CreateHardwareAssetRequest) => {
    setIsSubmitting(true);
    try {
      await updateAssetMutation.mutateAsync({ id: assetId, data });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
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

  if (!asset) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-center py-8">
            <p className="text-red-600">Failed to load asset details</p>
            <Button variant="outline" onClick={handleClose} className="mt-4">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Hardware Asset</DialogTitle>
          <DialogDescription>
            Update the details for {asset.model_name} (SN: {asset.serial_number})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Manufacturer *</Label>
                <Input
                  id="make"
                  {...register('make', { required: 'Manufacturer is required' })}
                  placeholder="e.g., Dell, Apple, HP"
                />
                {errors.make && (
                  <p className="text-sm text-red-600">{errors.make.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model *</Label>
                <Input
                  id="model"
                  {...register('model', { required: 'Model is required' })}
                  placeholder="e.g., Latitude 7420, MacBook Pro"
                />
                {errors.model && (
                  <p className="text-sm text-red-600">{errors.model.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  {...register('serialNumber', { required: 'Serial number is required' })}
                  placeholder="Enter serial number"
                />
                {errors.serialNumber && (
                  <p className="text-sm text-red-600">{errors.serialNumber.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetTag">Asset Tag</Label>
                <Input
                  id="assetTag"
                  {...register('assetTag')}
                  placeholder="e.g., IT-001234"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input
                  id="modelNumber"
                  {...register('modelNumber')}
                  placeholder="Specific model number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialStatus">Status</Label>
                <Select 
                  defaultValue={asset.status}
                  onValueChange={(value) => setValue('initialStatus', value as AssetStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="deployed">Deployed</SelectItem>
                    <SelectItem value="in_repair">In Repair</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="disposed">Disposed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Purchase Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Purchase Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Purchase Date</Label>
                <Input
                  id="purchaseDate"
                  type="date"
                  {...register('purchaseDate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseCost">Purchase Cost</Label>
                <Input
                  id="purchaseCost"
                  type="number"
                  step="0.01"
                  {...register('purchaseCost', { valueAsNumber: true })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyExpirationDate">Warranty Expiration</Label>
                <Input
                  id="warrantyExpirationDate"
                  type="date"
                  {...register('warrantyExpirationDate')}
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Any additional notes about this asset..."
                rows={3}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 