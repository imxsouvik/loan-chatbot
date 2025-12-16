import { z } from 'zod';
import { EmploymentType } from '@/types/auth';

export const emailSchema = z.string().email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .min(10, 'Phone number must be at least 10 digits')
  .regex(/^[\d\s\-+()]+$/, 'Please enter a valid phone number');

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  dateOfBirth: z.string().refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 100;
  }, 'You must be at least 18 years old'),
  city: z.string().min(2, 'Please enter your city'),
  employmentType: z.enum(['salaried', 'self-employed', 'business', 'freelancer', 'retired', 'student'] as const),
  monthlySalary: z.number().min(1000, 'Monthly salary must be at least ₹1,000'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export const kycSchema = z.object({
  address: z.string().min(10, 'Please enter your complete address'),
  pan: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number'),
  aadhaar: z.string().regex(/^\d{12}$/, 'Aadhaar must be 12 digits'),
  employerName: z.string().min(2, 'Please enter employer name'),
  employerAddress: z.string().min(10, 'Please enter employer address'),
  yearsEmployed: z.number().min(0, 'Years employed cannot be negative').max(50, 'Please enter a valid number'),
  existingEMIs: z.number().min(0, 'EMIs cannot be negative'),
});

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const getEmploymentTypeLabel = (type: EmploymentType): string => {
  const labels: Record<EmploymentType, string> = {
    salaried: 'Salaried',
    'self-employed': 'Self-Employed',
    business: 'Business Owner',
    freelancer: 'Freelancer',
    retired: 'Retired',
    student: 'Student',
  };
  return labels[type];
};
