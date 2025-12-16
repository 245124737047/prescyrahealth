import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, PatientProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: PatientProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<PatientProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultProfile: PatientProfile = {
  userId: '',
  name: '',
  age: 0,
  gender: 'other',
  bloodType: '',
  allergies: [],
  medicalConditions: [],
  emergencyContact: '',
  phoneNumber: '',
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('prescyra-user');
    const savedProfile = localStorage.getItem('prescyra-profile');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulated authentication
    const users = JSON.parse(localStorage.getItem('prescyra-users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const loggedInUser: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      };
      setUser(loggedInUser);
      localStorage.setItem('prescyra-user', JSON.stringify(loggedInUser));
      
      const savedProfile = localStorage.getItem(`prescyra-profile-${foundUser.id}`);
      if (savedProfile) {
        const userProfile = JSON.parse(savedProfile);
        setProfile(userProfile);
        localStorage.setItem('prescyra-profile', JSON.stringify(userProfile));
      } else {
        const newProfile: PatientProfile = {
          ...defaultProfile,
          userId: foundUser.id,
          name: foundUser.name,
        };
        setProfile(newProfile);
        localStorage.setItem('prescyra-profile', JSON.stringify(newProfile));
        localStorage.setItem(`prescyra-profile-${foundUser.id}`, JSON.stringify(newProfile));
      }
      
      return true;
    }
    return false;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('prescyra-users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return false;
    }
    
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
    };
    
    users.push(newUser);
    localStorage.setItem('prescyra-users', JSON.stringify(users));
    
    const loggedInUser: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };
    setUser(loggedInUser);
    localStorage.setItem('prescyra-user', JSON.stringify(loggedInUser));
    
    const newProfile: PatientProfile = {
      ...defaultProfile,
      userId: newUser.id,
      name: newUser.name,
    };
    setProfile(newProfile);
    localStorage.setItem('prescyra-profile', JSON.stringify(newProfile));
    localStorage.setItem(`prescyra-profile-${newUser.id}`, JSON.stringify(newProfile));
    
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('prescyra-user');
    localStorage.removeItem('prescyra-profile');
  }, []);

  const updateProfile = useCallback((updates: Partial<PatientProfile>) => {
    if (profile && user) {
      const updatedProfile = { ...profile, ...updates };
      setProfile(updatedProfile);
      localStorage.setItem('prescyra-profile', JSON.stringify(updatedProfile));
      localStorage.setItem(`prescyra-profile-${user.id}`, JSON.stringify(updatedProfile));
    }
  }, [profile, user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
