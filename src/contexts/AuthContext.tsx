import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import bcrypt from 'bcryptjs';
import { User, UserSession, AuthContextType, RegistrationData, LoginData } from '@/types/auth';
import {
  getUsers,
  saveUser,
  getUserByEmail,
  getUserById,
  getSession,
  saveSession,
  clearSession,
  saveOTP,
  getOTP,
  clearOTP,
  generateId,
  generateOTP,
  updateUser as updateUserStorage,
} from '@/utils/storage';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_DURATION_HOURS = 24;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const storedSession = getSession();
    if (storedSession) {
      const storedUser = getUserById(storedSession.userId);
      if (storedUser) {
        setUser(storedUser);
        setSession(storedSession);
      } else {
        clearSession();
      }
    }
    setIsLoading(false);
  }, []);

  const register = useCallback(async (data: RegistrationData): Promise<{ success: boolean; error?: string; otp?: string }> => {
    try {
      // Check if email already exists
      const existingUser = getUserByEmail(data.email);
      if (existingUser) {
        return { success: false, error: 'An account with this email already exists' };
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(data.password, salt);

      // Create user (not verified yet)
      const newUser: User = {
        id: generateId(),
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        phone: data.phone,
        passwordHash,
        dateOfBirth: data.dateOfBirth,
        city: data.city,
        employmentType: data.employmentType,
        monthlySalary: data.monthlySalary,
        createdAt: new Date().toISOString(),
        isVerified: false,
        kycCompleted: false,
      };

      saveUser(newUser);

      // Generate OTP for verification
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes
      saveOTP({ email: newUser.email, otp, expiresAt, purpose: 'registration' });

      return { success: true, otp }; // Return OTP for demo display
    } catch (error) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const verifyOTP = useCallback(async (email: string, otp: string): Promise<{ success: boolean; error?: string }> => {
    const storedOTP = getOTP(email.toLowerCase(), 'registration');
    
    if (!storedOTP) {
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (storedOTP.otp !== otp) {
      return { success: false, error: 'Invalid OTP. Please try again.' };
    }

    // Mark user as verified
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email.toLowerCase());
    if (userIndex >= 0) {
      users[userIndex].isVerified = true;
      localStorage.setItem('loan_app_users', JSON.stringify(users));
      
      // Clear OTP
      clearOTP(email.toLowerCase(), 'registration');
      
      // Auto-login after verification
      const verifiedUser = users[userIndex];
      const newSession: UserSession = {
        userId: verifiedUser.id,
        email: verifiedUser.email,
        fullName: verifiedUser.fullName,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString(),
      };
      
      saveSession(newSession);
      setUser(verifiedUser);
      setSession(newSession);
      
      return { success: true };
    }

    return { success: false, error: 'User not found' };
  }, []);

  const login = useCallback(async (data: LoginData): Promise<{ success: boolean; error?: string }> => {
    try {
      const foundUser = getUserByEmail(data.email);
      
      if (!foundUser) {
        return { success: false, error: 'No account found with this email' };
      }

      if (!foundUser.isVerified) {
        return { success: false, error: 'Please verify your email before logging in' };
      }

      const isValidPassword = await bcrypt.compare(data.password, foundUser.passwordHash);
      if (!isValidPassword) {
        return { success: false, error: 'Invalid password' };
      }

      // Create session
      const newSession: UserSession = {
        userId: foundUser.id,
        email: foundUser.email,
        fullName: foundUser.fullName,
        loginAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + SESSION_DURATION_HOURS * 60 * 60 * 1000).toISOString(),
      };

      saveSession(newSession);
      setUser(foundUser);
      setSession(newSession);

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    setSession(null);
  }, []);

  const forgotPassword = useCallback(async (email: string): Promise<{ success: boolean; error?: string; otp?: string }> => {
    const foundUser = getUserByEmail(email);
    
    if (!foundUser) {
      return { success: false, error: 'No account found with this email' };
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    saveOTP({ email: email.toLowerCase(), otp, expiresAt, purpose: 'forgot-password' });

    return { success: true, otp }; // Return OTP for demo display
  }, []);

  const resetPassword = useCallback(async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const storedOTP = getOTP(email.toLowerCase(), 'forgot-password');
    
    if (!storedOTP) {
      return { success: false, error: 'OTP has expired. Please request a new one.' };
    }

    if (storedOTP.otp !== otp) {
      return { success: false, error: 'Invalid OTP' };
    }

    // Update password
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === email.toLowerCase());
    
    if (userIndex >= 0) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(newPassword, salt);
      users[userIndex].passwordHash = passwordHash;
      localStorage.setItem('loan_app_users', JSON.stringify(users));
      clearOTP(email.toLowerCase(), 'forgot-password');
      return { success: true };
    }

    return { success: false, error: 'User not found' };
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      const updatedUser = updateUserStorage(user.id, updates);
      if (updatedUser) {
        setUser(updatedUser);
      }
    }
  }, [user]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user && !!session,
    login,
    register,
    verifyOTP,
    logout,
    forgotPassword,
    resetPassword,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
