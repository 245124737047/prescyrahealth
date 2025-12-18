import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { PatientProfile } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  profile: PatientProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<PatientProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (data && !error) {
      const patientProfile: PatientProfile = {
        userId: data.user_id,
        name: data.name || '',
        age: data.age || 0,
        gender: (data.gender as 'male' | 'female' | 'other') || 'other',
        bloodType: data.blood_type || '',
        allergies: data.allergies || [],
        medicalConditions: data.medical_conditions || [],
        emergencyContact: data.emergency_contact || '',
        phoneNumber: data.phone_number || '',
      };
      setProfile(patientProfile);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { success: false, error: 'An account with this email already exists. Please login instead.' };
      }
      return { success: false, error: error.message };
    }

    // Update the profile with the name
    if (data.user) {
      await supabase
        .from('profiles')
        .update({ name })
        .eq('user_id', data.user.id);
    }

    return { success: true };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<PatientProfile>) => {
    if (!user) return;

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.age !== undefined) dbUpdates.age = updates.age;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.bloodType !== undefined) dbUpdates.blood_type = updates.bloodType;
    if (updates.allergies !== undefined) dbUpdates.allergies = updates.allergies;
    if (updates.medicalConditions !== undefined) dbUpdates.medical_conditions = updates.medicalConditions;
    if (updates.emergencyContact !== undefined) dbUpdates.emergency_contact = updates.emergencyContact;
    if (updates.phoneNumber !== undefined) dbUpdates.phone_number = updates.phoneNumber;

    const { error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('user_id', user.id);

    if (!error && profile) {
      setProfile({ ...profile, ...updates });
    }
  }, [user, profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isLoading,
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
