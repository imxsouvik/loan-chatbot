import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  User, 
  CreditCard, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  IndianRupee
} from 'lucide-react';
import { formatCurrency, getEmploymentTypeLabel } from '@/utils/validation';
import Chatbot from '@/components/chatbot/Chatbot';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const quickActions = [
    {
      title: 'Apply for Loan',
      description: 'Start a new personal loan application',
      icon: FileText,
      action: () => navigate('/apply-loan'),
      variant: 'primary' as const,
      disabled: !user.kycCompleted,
      disabledReason: 'Complete KYC first',
    },
    {
      title: 'Complete KYC',
      description: user.kycCompleted ? 'Update your KYC details' : 'Required for loan application',
      icon: User,
      action: () => navigate('/profile'),
      variant: 'secondary' as const,
      badge: user.kycCompleted ? 'Completed' : 'Required',
      badgeVariant: user.kycCompleted ? 'success' : 'warning',
    },
    {
      title: 'My Applications',
      description: 'View your loan application history',
      icon: CreditCard,
      action: () => navigate('/applications'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {user.fullName.split(' ')[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's an overview of your account
          </p>
        </div>

        {/* KYC Alert */}
        {!user.kycCompleted && (
          <div className="mb-8 rounded-lg border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-warning mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground">Complete your KYC</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  You need to complete KYC verification before applying for a loan.
                </p>
                <Button 
                  size="sm" 
                  className="mt-3"
                  onClick={() => navigate('/profile')}
                >
                  Complete KYC
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Profile Summary */}
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Salary</p>
                <p className="text-2xl font-bold">{formatCurrency(user.monthlySalary)}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employment</p>
                <p className="text-lg font-semibold">{getEmploymentTypeLabel(user.employmentType)}</p>
              </div>
            </CardContent>
          </Card>

          <Card 
            onClick={() => !user.kycCompleted && navigate('/profile')}
            className={!user.kycCompleted ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {user.kycCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-success" />
                ) : (
                  <Clock className="h-6 w-6 text-warning" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">KYC Status</p>
                <p className="text-lg font-semibold">
                  {user.kycCompleted ? 'Verified' : 'Pending'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {quickActions.map((action) => (
              <Card 
                key={action.title}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  action.disabled ? 'opacity-60' : ''
                }`}
                onClick={() => !action.disabled && action.action()}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      action.variant === 'primary' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      <action.icon className="h-5 w-5" />
                    </div>
                    {action.badge && (
                      <Badge 
                        variant={action.badgeVariant === 'success' ? 'default' : 'secondary'}
                        className={action.badgeVariant === 'success' ? 'bg-success' : 'bg-warning text-warning-foreground'}
                      >
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>
                    {action.disabled ? action.disabledReason : action.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center text-sm text-primary">
                    {action.disabled ? 'Complete KYC to unlock' : 'Get started'}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How it works */}
        <Card>
          <CardHeader>
            <CardTitle>How it works</CardTitle>
            <CardDescription>
              Get your personal loan in 4 simple steps
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-4">
              {[
                { step: 1, title: 'Complete KYC', description: 'Verify your identity with PAN and Aadhaar' },
                { step: 2, title: 'Apply for Loan', description: 'Choose amount, tenure, and submit application' },
                { step: 3, title: 'Get Approval', description: 'Our system evaluates and approves quickly' },
                { step: 4, title: 'Receive Funds', description: 'Get your sanction letter and disbursement' },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="absolute left-4 top-10 hidden h-8 w-px bg-border md:block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <Chatbot />
    </div>
  );
};

export default Dashboard;
