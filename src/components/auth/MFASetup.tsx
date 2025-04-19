import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MFASetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const MFASetup: React.FC<MFASetupProps> = ({ isOpen, onClose }) => {
  const [factorId, setFactorId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  const enrollMFA = async () => {
    try {
      setIsEnrolling(true);
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp'
      });
      
      if (error) throw error;
      
      if (data?.id && data?.totp?.qr_code) {
        setFactorId(data.id);
        setQrCode(data.totp.qr_code);
      }
    } catch (error: any) {
      toast.error('Failed to start MFA enrollment: ' + error.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const verifyMFA = async () => {
    if (!factorId || !verifyCode || !challengeId) return;

    try {
      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      toast.success('MFA has been successfully set up!');
      onClose();
    } catch (error: any) {
      toast.error('Failed to verify MFA: ' + error.message);
    }
  };

  const challengeMFA = async () => {
    if (!factorId) return;

    try {
      const { data, error } = await supabase.auth.mfa.challenge({ factorId });
      if (error) throw error;
      if (data) {
        setChallengeId(data.id);
      }
    } catch (error: any) {
      toast.error('Failed to challenge MFA: ' + error.message);
    }
  };

  useEffect(() => {
    if (factorId) {
      challengeMFA();
    }
  }, [factorId]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Up Two-Factor Authentication</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {!qrCode ? (
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                Enhance your account security by setting up two-factor authentication
              </p>
              <Button onClick={enrollMFA} disabled={isEnrolling}>
                {isEnrolling ? 'Setting up...' : 'Begin Setup'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-center">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
              </div>
              
              <div className="text-sm text-gray-600">
                <p>1. Scan this QR code with your authenticator app</p>
                <p>2. Enter the 6-digit code shown in your app</p>
              </div>

              <div className="space-y-2">
                <InputOTP
                  maxLength={6}
                  value={verifyCode}
                  onChange={(value) => setVerifyCode(value)}
                  render={({ slots }) => (
                    <InputOTPGroup>
                      {slots.map((slot, i) => (
                        <InputOTPSlot key={i} {...slot} index={i} />
                      ))}
                    </InputOTPGroup>
                  )}
                />
                
                <Button 
                  className="w-full" 
                  onClick={verifyMFA}
                  disabled={verifyCode.length !== 6}
                >
                  Verify and Enable
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MFASetup;
