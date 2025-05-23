import { useState } from 'react';
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Users, Monitor } from 'lucide-react';
import { useSoftwareLicense, useCreateLicenseAssignment } from '@/hooks/use-software-licenses';
import type { CreateLicenseAssignmentRequest } from '@/types/api';

const assignmentSchema = z.object({
  assignment_type: z.enum(['user', 'device']),
  user_id: z.number().optional(),
  device_id: z.number().optional(),
  user_email: z.string().email().optional(),
  device_name: z.string().optional(),
}).refine((data) => {
  if (data.assignment_type === 'user') {
    return data.user_id || data.user_email;
  }
  if (data.assignment_type === 'device') {
    return data.device_id || data.device_name;
  }
  return false;
}, {
  message: "Please provide either user/device ID or email/name",
  path: ["assignment_type"],
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface AssignLicenseDialogProps {
  licenseId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignLicenseDialog({ licenseId, open, onOpenChange }: AssignLicenseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: license, isLoading } = useSoftwareLicense(licenseId);
  const createAssignmentMutation = useCreateLicenseAssignment();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      assignment_type: 'user',
    },
  });

  const assignmentType = form.watch('assignment_type');

  const onSubmit = async (data: AssignmentFormData) => {
    setIsSubmitting(true);
    try {
      const assignmentData: CreateLicenseAssignmentRequest = {
        softwareLicenseId: licenseId,
        assignmentType: data.assignment_type,
        assignedToUserId: data.user_id,
        assignedToDeviceId: data.device_id,
      };

      await createAssignmentMutation.mutateAsync(assignmentData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to assign license:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
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
        <DialogContent className="max-w-md">
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

  const availableSeats = license.available_seats || 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Assign License Seat
          </DialogTitle>
          <DialogDescription>
            Assign a seat for {license.software_name} to a user or device.
          </DialogDescription>
        </DialogHeader>

        {/* License Info */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Available Seats:</span>
            <Badge variant={availableSeats > 0 ? "default" : "destructive"}>
              {availableSeats} of {license.total_seats}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">License Model:</span>
            <Badge variant="secondary">
              {license.license_model.replace('_', ' ')}
            </Badge>
          </div>
        </div>

        {availableSeats <= 0 && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <div className="text-red-800 text-sm font-medium">
              No available seats
            </div>
            <div className="text-red-600 text-sm">
              All license seats are currently assigned. You may need to unassign existing seats or purchase additional licenses.
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Assignment Type */}
            <FormField
              control={form.control}
              name="assignment_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignment Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value || 'user'}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignment type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="user">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          User
                        </div>
                      </SelectItem>
                      <SelectItem value="device">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          Device
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* User Assignment Fields */}
            {assignmentType === 'user' && (
              <>
                <FormField
                  control={form.control}
                  name="user_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>User Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="user@company.com" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Device Assignment Fields */}
            {assignmentType === 'device' && (
              <>
                <FormField
                  control={form.control}
                  name="device_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Device Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="LAPTOP-001 or device hostname" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

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
                disabled={isSubmitting || availableSeats <= 0}
                className="min-w-[100px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  'Assign Seat'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
} 