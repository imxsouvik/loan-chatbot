import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { emailSchema, passwordSchema } from '@/utils/validation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

interface ForgotPasswordFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

const emailFormSchema = z.object({ email: emailSchema });
const resetFormSchema = z.object({
  otp: z.string().length(6, 'OTP must be 6 digits'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type EmailFormData = z.infer<typeof emailFormSchema>;
type ResetFormData = z.infer<typeof resetFormSchema>;

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onBack, onSuccess }) => {
  const { forgotPassword, resetPassword } = useAuth();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [displayOTP, setDisplayOTP] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailFormSchema),
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetFormSchema),
  });

  const handleEmailSubmit = async (data: EmailFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await forgotPassword(data.email);

    if (result.success && result.otp) {
      setEmail(data.email);
      setDisplayOTP(result.otp);
      setStep('reset');
    } else {
      setError(result.error || 'Failed to send OTP');
    }

    setIsLoading(false);
  };

  const handleResetSubmit = async (data: ResetFormData) => {
    setIsLoading(true);
    setError(null);

    const result = await resetPassword(email, data.otp, data.newPassword);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } else {
      setError(result.error || 'Failed to reset password');
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="animate-fade-in text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
          <CheckCircle2 className="h-8 w-8 text-success" />
        </div>
        <h2 className="text-xl font-semibold">Password Reset Successful</h2>
        <p className="mt-2 text-muted-foreground">
          Redirecting you to login...
        </p>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Forgot password?</h1>
          <p className="mt-2 text-muted-foreground">
            Enter your email and we'll send you a verification code
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10"
                {...emailForm.register('email')}
              />
            </div>
            {emailForm.formState.errors.email && (
              <p className="text-sm text-destructive">{emailForm.formState.errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending code...
              </>
            ) : (
              'Send Verification Code'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={onBack}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-muted-foreground">
          Enter the code sent to {email}
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

      <form onSubmit={resetForm.handleSubmit(handleResetSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="000000"
            className="text-center text-xl tracking-[0.3em] font-mono"
            maxLength={6}
            {...resetForm.register('otp')}
          />
          {resetForm.formState.errors.otp && (
            <p className="text-sm text-destructive">{resetForm.formState.errors.otp.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...resetForm.register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {resetForm.formState.errors.newPassword && (
            <p className="text-sm text-destructive">{resetForm.formState.errors.newPassword.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...resetForm.register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-primary"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {resetForm.formState.errors.confirmPassword && (
            <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Resetting password...
            </>
          ) : (
            'Reset Password'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setStep('email')}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Try different email
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
