import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Medication, Reminder, NotificationSettings } from '@/lib/types';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MedicationContextType {
  medications: Medication[];
  reminders: Reminder[];
  notificationSettings: NotificationSettings;
  isLoading: boolean;
  addMedication: (medication: Omit<Medication, 'id' | 'userId'>) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  markReminderAsTaken: (id: string) => Promise<void>;
  snoozeReminder: (id: string, minutes: number) => Promise<void>;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => Promise<void>;
  generateDailyReminders: () => Promise<void>;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sms: false,
    email: true,
    app: true,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch medications from database
  const fetchMedications = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data && !error) {
      const meds: Medication[] = data.map(m => ({
        id: m.id,
        userId: m.user_id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency as Medication['frequency'],
        duration: m.duration || '',
        startDate: m.start_date,
        endDate: m.end_date || '',
        instructions: m.instructions || '',
        status: m.status as Medication['status'],
        reminderTimes: m.reminder_times || [],
      }));
      setMedications(meds);
    }
  }, [user]);

  // Fetch reminders from database
  const fetchReminders = useCallback(async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .order('scheduled_time', { ascending: true });
    
    if (data && !error) {
      const rems: Reminder[] = data.map(r => ({
        id: r.id,
        medicationId: r.medication_id || '',
        medicationName: r.medication_name,
        dosage: r.dosage,
        scheduledTime: r.scheduled_time,
        status: r.status as Reminder['status'],
        date: r.date,
      }));
      setReminders(rems);
    }
  }, [user]);

  // Fetch notification settings
  const fetchNotificationSettings = useCallback(async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    
    if (data && !error) {
      setNotificationSettings({
        sms: data.sms,
        email: data.email,
        app: data.app,
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      Promise.all([
        fetchMedications(),
        fetchReminders(),
        fetchNotificationSettings(),
      ]).finally(() => setIsLoading(false));
    } else {
      setMedications([]);
      setReminders([]);
      setIsLoading(false);
    }
  }, [user, fetchMedications, fetchReminders, fetchNotificationSettings]);

  const addMedication = useCallback(async (medication: Omit<Medication, 'id' | 'userId'>) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('medications')
      .insert({
        user_id: user.id,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        duration: medication.duration || null,
        start_date: medication.startDate,
        end_date: medication.endDate || null,
        instructions: medication.instructions || null,
        status: medication.status,
        reminder_times: medication.reminderTimes,
      })
      .select()
      .single();
    
    if (data && !error) {
      const newMed: Medication = {
        id: data.id,
        userId: data.user_id,
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency as Medication['frequency'],
        duration: data.duration || '',
        startDate: data.start_date,
        endDate: data.end_date || '',
        instructions: data.instructions || '',
        status: data.status as Medication['status'],
        reminderTimes: data.reminder_times || [],
      };
      setMedications(prev => [newMed, ...prev]);
    }
  }, [user]);

  const updateMedication = useCallback(async (id: string, updates: Partial<Medication>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.dosage !== undefined) dbUpdates.dosage = updates.dosage;
    if (updates.frequency !== undefined) dbUpdates.frequency = updates.frequency;
    if (updates.duration !== undefined) dbUpdates.duration = updates.duration || null;
    if (updates.startDate !== undefined) dbUpdates.start_date = updates.startDate;
    if (updates.endDate !== undefined) dbUpdates.end_date = updates.endDate || null;
    if (updates.instructions !== undefined) dbUpdates.instructions = updates.instructions || null;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.reminderTimes !== undefined) dbUpdates.reminder_times = updates.reminderTimes;

    const { error } = await supabase
      .from('medications')
      .update(dbUpdates)
      .eq('id', id);
    
    if (!error) {
      setMedications(prev => prev.map(med =>
        med.id === id ? { ...med, ...updates } : med
      ));
    }
  }, []);

  const deleteMedication = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('medications')
      .delete()
      .eq('id', id);
    
    if (!error) {
      setMedications(prev => prev.filter(med => med.id !== id));
      setReminders(prev => prev.filter(rem => rem.medicationId !== id));
    }
  }, []);

  const generateDailyReminders = useCallback(async () => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const activeMeds = medications.filter(med => med.status === 'active');
    
    // Delete existing reminders for today
    await supabase
      .from('reminders')
      .delete()
      .eq('user_id', user.id)
      .eq('date', today);
    
    const newReminders: Array<{
      user_id: string;
      medication_id: string;
      medication_name: string;
      dosage: string;
      scheduled_time: string;
      status: string;
      date: string;
    }> = [];
    
    activeMeds.forEach(med => {
      const times = med.reminderTimes.length > 0 ? med.reminderTimes : getDefaultTimes(med.frequency);
      
      times.forEach(time => {
        newReminders.push({
          user_id: user.id,
          medication_id: med.id,
          medication_name: med.name,
          dosage: med.dosage,
          scheduled_time: time,
          status: 'upcoming',
          date: today,
        });
      });
    });
    
    if (newReminders.length > 0) {
      const { data, error } = await supabase
        .from('reminders')
        .insert(newReminders)
        .select();
      
      if (data && !error) {
        const rems: Reminder[] = data.map(r => ({
          id: r.id,
          medicationId: r.medication_id || '',
          medicationName: r.medication_name,
          dosage: r.dosage,
          scheduledTime: r.scheduled_time,
          status: r.status as Reminder['status'],
          date: r.date,
        }));
        setReminders(rems);
      }
    } else {
      setReminders([]);
    }
  }, [user, medications]);

  const markReminderAsTaken = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('reminders')
      .update({ status: 'taken' })
      .eq('id', id);
    
    if (!error) {
      setReminders(prev => prev.map(rem =>
        rem.id === id ? { ...rem, status: 'taken' as const } : rem
      ));
    }
  }, []);

  const snoozeReminder = useCallback(async (id: string, minutes: number) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;
    
    const [hours, mins] = reminder.scheduledTime.split(':').map(Number);
    const newDate = new Date();
    newDate.setHours(hours, mins + minutes);
    const newTime = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
    
    const { error } = await supabase
      .from('reminders')
      .update({ scheduled_time: newTime, status: 'snoozed' })
      .eq('id', id);
    
    if (!error) {
      setReminders(prev => prev.map(rem =>
        rem.id === id ? { ...rem, scheduledTime: newTime, status: 'snoozed' as const } : rem
      ));
    }
  }, [reminders]);

  const updateNotificationSettings = useCallback(async (settings: Partial<NotificationSettings>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from('notification_settings')
      .update(settings)
      .eq('user_id', user.id);
    
    if (!error) {
      setNotificationSettings(prev => ({ ...prev, ...settings }));
    }
  }, [user]);

  return (
    <MedicationContext.Provider
      value={{
        medications,
        reminders,
        notificationSettings,
        isLoading,
        addMedication,
        updateMedication,
        deleteMedication,
        markReminderAsTaken,
        snoozeReminder,
        updateNotificationSettings,
        generateDailyReminders,
      }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

const getDefaultTimes = (frequency: Medication['frequency']): string[] => {
  switch (frequency) {
    case 'once':
      return ['08:00'];
    case 'twice':
      return ['08:00', '20:00'];
    case 'thrice':
      return ['08:00', '14:00', '20:00'];
    case 'every4h':
      return ['06:00', '10:00', '14:00', '18:00', '22:00'];
    case 'every6h':
      return ['06:00', '12:00', '18:00', '00:00'];
    case 'every8h':
      return ['06:00', '14:00', '22:00'];
    case 'asNeeded':
      return [];
    default:
      return ['08:00'];
  }
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};
