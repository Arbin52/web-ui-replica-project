
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useNetworks } from '@/hooks/useNetworks';
import { toast } from 'sonner';

interface AddNetworkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNetworkAdded: () => void;
}

const networkSchema = z.object({
  name: z.string().min(1, "Network name is required"),
  ssid: z.string().optional(),
  gateway_ip: z.string().optional().refine(
    (value) => !value || /^(\d{1,3}\.){3}\d{1,3}$/.test(value),
    {
      message: "Invalid IP address format, should be like 192.168.1.1",
    }
  ),
});

type NetworkFormValues = z.infer<typeof networkSchema>;

const AddNetworkDialog: React.FC<AddNetworkDialogProps> = ({ 
  open, 
  onOpenChange,
  onNetworkAdded
}) => {
  const { addNetwork } = useNetworks();
  
  const form = useForm<NetworkFormValues>({
    resolver: zodResolver(networkSchema),
    defaultValues: {
      name: '',
      ssid: '',
      gateway_ip: '',
    },
  });

  const onSubmit = async (values: NetworkFormValues) => {
    try {
      await addNetwork({
        name: values.name,
        ssid: values.ssid || null,
        gateway_ip: values.gateway_ip || null,
      });
      
      toast.success('Network added successfully');
      form.reset();
      onOpenChange(false);
      onNetworkAdded();
    } catch (error) {
      console.error('Error adding network:', error);
      toast.error('Failed to add network');
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Network</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Home Network" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ssid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SSID</FormLabel>
                  <FormControl>
                    <Input placeholder="MyWiFi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gateway_ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gateway IP</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button"
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Adding...' : 'Add Network'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNetworkDialog;
