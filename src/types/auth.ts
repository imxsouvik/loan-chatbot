export type EmploymentType = 'salaried' | 'self-employed' | 'business' | 'freelancer' | 'retired' | 'student';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  passwordHash: string;
  dateOfBirth: string;
  city: string;
  employmentType: EmploymentType;
  monthlySalary: number;
  createdAt: string;
  isVerified: boolean;
  kycCompleted: boolean;
}

export interface UserSession {
  userId: string;
  email: string;
  fullName: string;
  loginAt: string;
  expiresAt: string;
}

export interface KYCData {
  userId: string;
  address: string;
  pan: string;
  aadhaar: string;
  employerName: string;
  employerAddress: string;
  yearsEmployed: number;
  existingEMIs: number;
  completedAt: string;
}

export interface OTPVerification {
  email: string;
  otp: string;
  expiresAt: string;
  purpose: 'registration' | 'forgot-password';
}

export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  city: string;
  employmentType: EmploymentType;
  monthlySalary: number;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  session: UserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegistrationData) => Promise<{ success: boolean; error?: string; otp?: string }>;
  verifyOTP: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; otp?: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => void;
}
