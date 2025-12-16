import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Shield, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Award
} from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Clock,
      title: 'Quick Approval',
      description: 'Get your loan approved within 24 hours with our streamlined process.',
    },
    {
      icon: IndianRupee,
      title: 'Competitive Rates',
      description: 'Enjoy interest rates starting from 10.5% p.a. with flexible tenures.',
    },
    {
      icon: Shield,
      title: 'Secure Process',
      description: 'Your data is encrypted and protected with bank-grade security.',
    },
    {
      icon: FileText,
      title: 'Minimal Documentation',
      description: 'Simple KYC verification with digital document upload.',
    },
  ];

  const stats = [
    { value: '₹50L+', label: 'Loans Disbursed' },
    { value: '10,000+', label: 'Happy Customers' },
    { value: '4.8★', label: 'Customer Rating' },
    { value: '15+', label: 'Years Experience' },
  ];

  const steps = [
    { step: 1, title: 'Register & Verify', description: 'Create your account and complete OTP verification' },
    { step: 2, title: 'Complete KYC', description: 'Submit your PAN, Aadhaar, and employment details' },
    { step: 3, title: 'Apply for Loan', description: 'Choose your loan amount and preferred tenure' },
    { step: 4, title: 'Get Approved', description: 'Receive instant decision and download sanction letter' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background py-20 lg:py-32">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm text-primary">
              <Award className="h-4 w-4" />
              Trusted by 10,000+ customers across India
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Personal Loans Made
              <span className="text-primary"> Simple & Fast</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Get instant approval on personal loans up to ₹25 lakhs with competitive interest rates 
              and flexible repayment options. Apply online in minutes.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Apply Now'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/auth')}
              >
                {isAuthenticated ? 'View Applications' : 'Sign In'}
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                No hidden charges
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Quick disbursal
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
                100% online
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-border bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">Why Choose LoanPro?</h2>
            <p className="mt-4 text-muted-foreground">
              Experience a hassle-free loan process with our customer-centric approach
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-lg border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
            <p className="mt-4 text-muted-foreground">
              Get your personal loan in just 4 simple steps
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-7 hidden h-0.5 w-full bg-border lg:block" style={{ width: 'calc(100% - 3.5rem)', left: 'calc(50% + 1.75rem)' }} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button 
              size="lg"
              onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=register')}
            >
              {isAuthenticated ? 'Start Application' : 'Get Started Now'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl bg-primary p-8 text-center text-primary-foreground md:p-12">
            <Users className="mx-auto mb-4 h-12 w-12 opacity-80" />
            <h2 className="text-2xl font-bold md:text-3xl">Ready to get started?</h2>
            <p className="mx-auto mt-4 max-w-xl opacity-90">
              Join thousands of satisfied customers who have trusted us with their financial needs.
              Apply now and get instant approval.
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/auth?mode=register')}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
              </Button>
              <Button 
                size="lg" 
                variant="ghost" 
                className="text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate('/auth')}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold">LoanPro</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 LoanPro. All rights reserved. Demo application for educational purposes.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
