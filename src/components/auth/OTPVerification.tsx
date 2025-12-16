import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  displayOTP: string;
  onBack: () => void;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({ email, displayOTP, onBack }) => {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await verifyOTP(email, otp);

    if (!result.success) {
      setError(result.error || 'Verification failed');
      setIsLoading(false);
    }
    // If successful, auth context will update and redirect will happen automatically
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="mt-2 text-muted-foreground">
          We've sent a verification code to<br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Demo OTP Display */}
      <Alert className="mb-6 border-primary/20 bg-primary/5">
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <AlertDescription className="ml-2">
          <span className="text-muted-foreground">Demo Mode: Your OTP is </span>
          <span className="font-mono font-bold text-primary">{displayOTP}</span>
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Enter 6-digit code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            className="text-center text-2xl tracking-[0.5em] font-mono"
            maxLength={6}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={onBack}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to registration
        </button>
      </div>
    </div>
  );
};

export default OTPVerification;
