
import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Wifi, Lock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PasswordDialogProps {
  showPasswordDialog: boolean;
  setShowPasswordDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNetwork: { id: number; ssid: string } | null;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  handleSubmitPassword: () => void;
  isConnecting: boolean;
  error?: string | null;
}

// Create a schema for the password
const formSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(63, { message: "WiFi passwords can't be longer than 63 characters" })
});

const PasswordDialog: React.FC<PasswordDialogProps> = ({
  showPasswordDialog,
  setShowPasswordDialog,
  selectedNetwork,
  password,
  setPassword,
  handleSubmitPassword,
  isConnecting,
  error
}) => {
  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: ""
    }
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setPassword(values.password);
    handleSubmitPassword();
  };

  // When dialog opens, reset the form
  React.useEffect(() => {
    if (showPasswordDialog) {
      form.reset({ password: "" });
    }
  }, [showPasswordDialog, form]);

  return (
    <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Connect to {selectedNetwork?.ssid}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 pt-2">
            <Lock className="h-3 w-3" />
            <span>This network requires a password</span>
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Network Password</FormLabel>
                  <FormControl>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter network password" 
                      {...field} 
                      disabled={isConnecting}
                      autoFocus
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => setShowPasswordDialog(false)}
                disabled={isConnecting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
