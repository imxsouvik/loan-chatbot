import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import OTPVerification from '@/components/auth/OTPVerification';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { FileText } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'verify-otp' | 'forgot-password';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();
  
  const [mode, setMode] = useState<AuthMode>(() => {
    const modeParam = searchParams.get('mode');
    return modeParam === 'register' ? 'register' : 'login';
  });
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingOTP, setPendingOTP] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleRegistrationSuccess = (email: string, otp: string) => {
    setPendingEmail(email);
    setPendingOTP(otp);
    setMode('verify-otp');
  };

  const handleForgotPasswordSuccess = () => {
    setMode('login');
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10">
            <FileText className="h-6 w-6" />
          </div>
          <span className="text-2xl font-semibold">LoanPro</span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Your trusted partner for
            <br />
            personal loans
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Quick approvals, competitive rates, and a seamless experience
            from application to disbursement.
          </p>
          <div className="flex gap-8">
            <div>
              <div className="text-3xl font-bold">₹50L+</div>
              <div className="text-sm text-primary-foreground/70">Loans Disbursed</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-primary-foreground/70">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold">24h</div>
              <div className="text-sm text-primary-foreground/70">Quick Approval</div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-primary-foreground/60">
          © 2024 LoanPro. All rights reserved.
        </p>
      </div>

      {/* Right side - Auth forms */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <FileText className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-semibold">LoanPro</span>
          </div>

          {mode === 'login' && (
            <LoginForm
              onSwitchToRegister={() => setMode('register')}
              onForgotPassword={() => setMode('forgot-password')}
            />
          )}

          {mode === 'register' && (
            <RegisterForm
              onSwitchToLogin={() => setMode('login')}
              onSuccess={handleRegistrationSuccess}
            />
          )}

          {mode === 'verify-otp' && (
            <OTPVerification
              email={pendingEmail}
              displayOTP={pendingOTP}
              onBack={() => setMode('register')}
            />
          )}

          {mode === 'forgot-password' && (
            <ForgotPasswordForm
              onBack={() => setMode('login')}
              onSuccess={handleForgotPasswordSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
