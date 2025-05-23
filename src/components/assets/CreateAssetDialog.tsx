import { useState } from 'react';
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
import { useCreateHardwareAsset } from '@/hooks/use-hardware-assets';
import { useManufacturers, useAssetCategories } from '@/hooks/use-hardware-assets';
import type { CreateHardwareAssetRequest, AssetStatus } from '@/types/api';

interface CreateAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAssetDialog({ open, onOpenChange }: CreateAssetDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createAssetMutation = useCreateHardwareAsset();
  const { data: manufacturers } = useManufacturers();
  const { data: categories } = useAssetCategories();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateHardwareAssetRequest>();

  const onSubmit = async (data: CreateHardwareAssetRequest) => {
    setIsSubmitting(true);
    try {
      await createAssetMutation.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to create asset:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Hardware Asset</DialogTitle>
          <DialogDescription>
            Enter the details for the new hardware asset. Required fields are marked with *.
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
                <Label htmlFor="assetType">Asset Type *</Label>
                <Input
                  id="assetType"
                  {...register('assetType', { required: 'Asset type is required' })}
                  placeholder="e.g., Laptop, Desktop, Server"
                />
                {errors.assetType && (
                  <p className="text-sm text-red-600">{errors.assetType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelNumber">Model Number</Label>
                <Input
                  id="modelNumber"
                  {...register('modelNumber')}
                  placeholder="Specific model number"
                />
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Technical Specifications</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpu">CPU</Label>
                <Input
                  id="cpu"
                  {...register('cpu')}
                  placeholder="e.g., Intel i7-11800H"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  {...register('ram')}
                  placeholder="e.g., 16GB DDR4"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  {...register('storage')}
                  placeholder="e.g., 512GB SSD"
                />
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
                <Label htmlFor="poNumber">PO Number</Label>
                <Input
                  id="poNumber"
                  {...register('poNumber')}
                  placeholder="Purchase order number"
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

              <div className="space-y-2">
                <Label htmlFor="initialStatus">Initial Status</Label>
                <Select onValueChange={(value) => setValue('initialStatus', value as AssetStatus)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="deployed">Deployed</SelectItem>
                    <SelectItem value="in_repair">In Repair</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                  </SelectContent>
                </Select>
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
              {isSubmitting ? 'Creating...' : 'Create Asset'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 