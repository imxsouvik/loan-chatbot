import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { STORAGE_KEYS } from '@/utils/storage';

export interface LoanApplication {
  id: string;
  userId: string;
  type: string;
  amount: number;
  tenure: number;
  interestRate: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

interface LoanContextType {
  applications: LoanApplication[];
  addApplication: (application: Omit<LoanApplication, 'id' | 'date' | 'userId'>) => string;
  updateApplication: (id: string, data: Partial<Omit<LoanApplication, 'id' | 'userId'>>) => LoanApplication | undefined;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<LoanApplication[]>([]);

  useEffect(() => {
    const allApplications: LoanApplication[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
    if (user) {
      setApplications(allApplications.filter(app => app.userId === user.id));
    } else {
      setApplications([]);
    }
  }, [user]);

  useEffect(() => {
    // This effect runs only when applications state changes, to update the localStorage
    // It must be careful not to overwrite applications of other users.
    if(user){
      const allApplications: LoanApplication[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
      const otherUserApplications = allApplications.filter(app => app.userId !== user.id);
      const userApplications = applications;
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([...otherUserApplications, ...userApplications]));
    }
  }, [applications, user]);

  const addApplication = (data: Omit<LoanApplication, 'id' | 'date' | 'userId'>) => {
    if (!user) {
      throw new Error("User is not authenticated");
    }
    const newApplication: LoanApplication = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      date: new Date().toISOString(),
      status: data.status || 'Pending',
    };
    setApplications((prev) => [newApplication, ...prev]);
    return newApplication.id;
  };

  const updateApplication = (id: string, data: Partial<Omit<LoanApplication, 'id' | 'userId'>>) => {
    let updatedApplication: LoanApplication | undefined;
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const newApp: LoanApplication = { ...app, ...data, date: new Date().toISOString() };
        updatedApplication = newApp;
        return newApp;
      }
      return app;
    }));
    return updatedApplication;
  };

  return (
    <LoanContext.Provider value={{ applications, addApplication, updateApplication }}>
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};