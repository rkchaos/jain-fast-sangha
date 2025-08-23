import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/components/ui/use-toast';

interface OtpVerifyProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

export const OtpVerify: React.FC<OtpVerifyProps> = ({ phone, onVerify, onResend }) => {
  const [otp, setOtp] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = () => {
    if (otp.length >= 4) {
      onVerify(otp);
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid OTP",
        variant: "destructive"
      });
    }
  };

  const handleResend = () => {
    if (!isResendDisabled) {
      onResend();
      setResendCooldown(30);
      setIsResendDisabled(true);
      setOtp('');
      toast({
        title: "OTP Sent",
        description: "A new OTP has been sent to your phone"
      });
    }
  };

  const formatPhone = (phone: string) => {
    return `+91 ${phone.slice(0, 5)} ${phone.slice(5)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl text-foreground">Verify Phone Number</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the OTP sent to {formatPhone(phone)}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              autoFocus
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleVerify} 
              className="w-full" 
              size="lg"
              disabled={otp.length < 4}
            >
              Verify
            </Button>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={handleResend}
                disabled={isResendDisabled}
                className="text-sm"
              >
                {isResendDisabled 
                  ? `Resend OTP in ${resendCooldown}s` 
                  : "Resend OTP"
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};