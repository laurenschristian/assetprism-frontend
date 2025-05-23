import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useSoftwareLicense, useUpdateSoftwareLicense } from '@/hooks/use-software-licenses';
import type { 
  CreateSoftwareLicenseRequest,
  LicenseType, 
  LicenseModel
} from '@/types/api';

const licenseSchema = z.object({
  software_name: z.string().min(1, 'Software name is required'),
  publisher: z.string().min(1, 'Publisher is required'),
  version: z.string().optional(),
  license_key: z.string().optional(),
  license_type: z.enum(['perpetual', 'subscription', 'volume', 'oem', 'trial', 'educational', 'enterprise_agreement']),
  license_model: z.enum(['per_user', 'per_device', 'per_core', 'per_processor', 'concurrent', 'named_user', 'site_license', 'enterprise']),
  total_seats: z.number().min(1, 'Must have at least 1 seat'),
  purchase_date: z.date(),
  expiration_date: z.date().optional(),
  annual_cost: z.number().min(0, 'Cost must be positive').optional(),
  vendor_name: z.string().optional(),
  contract_number: z.string().optional(),
  support_expiration: z.date().optional(),
  notes: z.string().optional(),
});

type LicenseFormData = z.infer<typeof licenseSchema>;

interface EditLicenseDialogProps {
  licenseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LICENSE_TYPES: { value: LicenseType; label: string }[] = [
  { value: 'perpetual', label: 'Perpetual' },
  { value: 'subscription', label: 'Subscription' },
  { value: 'volume', label: 'Volume License' },
  { value: 'oem', label: 'OEM' },
  { value: 'trial', label: 'Trial' },
  { value: 'educational', label: 'Educational' },
  { value: 'enterprise_agreement', label: 'Enterprise Agreement' },
];

const LICENSE_MODELS: { value: LicenseModel; label: string }[] = [
  { value: 'per_user', label: 'Per User' },
  { value: 'per_device', label: 'Per Device' },
  { value: 'per_core', label: 'Per Core' },
  { value: 'per_processor', label: 'Per Processor' },
  { value: 'concurrent', label: 'Concurrent' },
  { value: 'named_user', label: 'Named User' },
  { value: 'site_license', label: 'Site License' },
  { value: 'enterprise', label: 'Enterprise' },
];

export function EditLicenseDialog({ licenseId, open, onOpenChange }: EditLicenseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: license, isLoading } = useSoftwareLicense(licenseId);
  const updateLicenseMutation = useUpdateSoftwareLicense();

  const form = useForm<LicenseFormData>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      software_name: '',
      publisher: '',
      version: '',
      license_key: '',
      license_type: 'subscription',
      license_model: 'per_user',
      total_seats: 1,
      purchase_date: new Date(),
      annual_cost: 0,
      vendor_name: '',
      contract_number: '',
      notes: '',
    },
  });

  // Update form when license data is loaded
  useEffect(() => {
    if (license) {
      form.reset({
        software_name: license.software_name,
        publisher: license.software_publisher,
        version: license.software_version || '',
        license_key: license.license_key || '',
        license_type: license.license_type,
        license_model: license.license_model,
        total_seats: license.total_seats,
        purchase_date: license.purchase_date ? new Date(license.purchase_date) : new Date(),
        expiration_date: license.expiration_date ? new Date(license.expiration_date) : undefined,
        annual_cost: license.total_cost || 0,
        vendor_name: license.vendor_name || '',
        contract_number: license.purchase_order_number || '',
        support_expiration: license.maintenance_expiration_date ? new Date(license.maintenance_expiration_date) : undefined,
        notes: license.notes || '',
      });
    }
  }, [license, form]);

  const onSubmit = async (data: LicenseFormData) => {
    setIsSubmitting(true);
    try {
      // Convert form data to API request format
      const licenseData: Partial<CreateSoftwareLicenseRequest> = {
        softwareName: data.software_name,
        softwareVersion: data.version,
        softwarePublisher: data.publisher,
        licenseKey: data.license_key,
        licenseType: data.license_type,
        licenseModel: data.license_model,
        totalSeats: data.total_seats,
        totalCost: data.annual_cost,
        purchaseDate: data.purchase_date.toISOString(),
        expirationDate: data.expiration_date?.toISOString(),
        maintenanceExpirationDate: data.support_expiration?.toISOString(),
        purchaseOrderNumber: data.contract_number,
        vendorName: data.vendor_name,
        notes: data.notes,
        isActive: true,
      };

      await updateLicenseMutation.mutateAsync({ id: licenseId, data: licenseData });
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update license:', error);
    } finally {
      setIsSubmitting(false);
    }
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Software License
          </DialogTitle>
          <DialogDescription>
            Update the details for {license?.software_name}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="software_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Software Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Microsoft Office 365" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publisher"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publisher *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Microsoft Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license_key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter license key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      License key will be stored securely
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* License Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="license_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'subscription'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LICENSE_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="license_model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Model *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || 'per_user'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select license model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {LICENSE_MODELS.map((model) => (
                          <SelectItem key={model.value} value={model.value}>
                            {model.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_seats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Seats *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="purchase_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Purchase Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiration_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expiration Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Leave empty for perpetual licenses
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="support_expiration"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Support Expiration</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date: Date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Financial & Contract Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="annual_cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Annual Cost ($)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., CDW Corporation" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contract_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Contract reference" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Additional information about this license..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Update License'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 