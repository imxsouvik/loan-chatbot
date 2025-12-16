import { User, UserSession, KYCData, OTPVerification } from '@/types/auth';

export const STORAGE_KEYS = {
  USERS: 'loan_app_users',
  SESSION: 'loan_app_session',
  KYC: 'loan_app_kyc',
  OTP: 'loan_app_otp',
  APPLICATIONS: 'loan_app_applications',
  CHAT_HISTORY: 'loan_app_chat_history',
} as const;

// User Storage
export const getUsers = (): User[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.id === user.id);
  if (existingIndex >= 0) {
    users[existingIndex] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
};

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(u => u.id === id);
};

export const updateUser = (userId: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === userId);
  if (index >= 0) {
    users[index] = { ...users[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return users[index];
  }
  return null;
};

// Session Storage
export const getSession = (): UserSession | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (!data) return null;
    const session: UserSession = JSON.parse(data);
    if (new Date(session.expiresAt) < new Date()) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
};

export const saveSession = (session: UserSession): void => {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
};

export const clearSession = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

// KYC Storage
export const getKYC = (userId: string): KYCData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KYC);
    if (!data) return null;
    const kycRecords: KYCData[] = JSON.parse(data);
    return kycRecords.find(k => k.userId === userId) || null;
  } catch {
    return null;
  }
};

export const saveKYC = (kyc: KYCData): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.KYC);
    const kycRecords: KYCData[] = data ? JSON.parse(data) : [];
    const existingIndex = kycRecords.findIndex(k => k.userId === kyc.userId);
    if (existingIndex >= 0) {
      kycRecords[existingIndex] = kyc;
    } else {
      kycRecords.push(kyc);
    }
    localStorage.setItem(STORAGE_KEYS.KYC, JSON.stringify(kycRecords));
  } catch {
    console.error('Failed to save KYC data');
  }
};

// OTP Storage
export const saveOTP = (otpData: OTPVerification): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OTP);
    const otpRecords: OTPVerification[] = data ? JSON.parse(data) : [];
    const existingIndex = otpRecords.findIndex(o => o.email === otpData.email && o.purpose === otpData.purpose);
    if (existingIndex >= 0) {
      otpRecords[existingIndex] = otpData;
    } else {
      otpRecords.push(otpData);
    }
    localStorage.setItem(STORAGE_KEYS.OTP, JSON.stringify(otpRecords));
  } catch {
    console.error('Failed to save OTP');
  }
};

export const getOTP = (email: string, purpose: 'registration' | 'forgot-password'): OTPVerification | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OTP);
    if (!data) return null;
    const otpRecords: OTPVerification[] = JSON.parse(data);
    const record = otpRecords.find(o => o.email === email && o.purpose === purpose);
    if (record && new Date(record.expiresAt) < new Date()) {
      return null;
    }
    return record || null;
  } catch {
    return null;
  }
};

export const clearOTP = (email: string, purpose: 'registration' | 'forgot-password'): void => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.OTP);
    if (!data) return;
    const otpRecords: OTPVerification[] = JSON.parse(data);
    const filtered = otpRecords.filter(o => !(o.email === email && o.purpose === purpose));
    localStorage.setItem(STORAGE_KEYS.OTP, JSON.stringify(filtered));
  } catch {
    console.error('Failed to clear OTP');
  }
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

// Generate OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
