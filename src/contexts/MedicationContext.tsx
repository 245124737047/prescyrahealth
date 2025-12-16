import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Medication, Reminder, NotificationSettings } from '@/lib/types';
import { useAuth } from './AuthContext';

interface MedicationContextType {
  medications: Medication[];
  reminders: Reminder[];
  notificationSettings: NotificationSettings;
  addMedication: (medication: Omit<Medication, 'id' | 'userId'>) => void;
  updateMedication: (id: string, updates: Partial<Medication>) => void;
  deleteMedication: (id: string) => void;
  markReminderAsTaken: (id: string) => void;
  snoozeReminder: (id: string, minutes: number) => void;
  updateNotificationSettings: (settings: Partial<NotificationSettings>) => void;
  generateDailyReminders: () => void;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    sms: true,
    email: true,
    app: true,
  });

  useEffect(() => {
    if (user) {
      const savedMedications = localStorage.getItem(`prescyra-medications-${user.id}`);
      const savedReminders = localStorage.getItem(`prescyra-reminders-${user.id}`);
      const savedSettings = localStorage.getItem(`prescyra-notification-settings-${user.id}`);
      
      if (savedMedications) {
        setMedications(JSON.parse(savedMedications));
      }
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
      if (savedSettings) {
        setNotificationSettings(JSON.parse(savedSettings));
      }
    } else {
      setMedications([]);
      setReminders([]);
    }
  }, [user]);

  const saveMedications = useCallback((meds: Medication[]) => {
    if (user) {
      localStorage.setItem(`prescyra-medications-${user.id}`, JSON.stringify(meds));
    }
  }, [user]);

  const saveReminders = useCallback((rems: Reminder[]) => {
    if (user) {
      localStorage.setItem(`prescyra-reminders-${user.id}`, JSON.stringify(rems));
    }
  }, [user]);

  const addMedication = useCallback((medication: Omit<Medication, 'id' | 'userId'>) => {
    if (!user) return;
    
    const newMedication: Medication = {
      ...medication,
      id: `med-${Date.now()}`,
      userId: user.id,
    };
    
    const updatedMedications = [...medications, newMedication];
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
  }, [user, medications, saveMedications]);

  const updateMedication = useCallback((id: string, updates: Partial<Medication>) => {
    const updatedMedications = medications.map(med =>
      med.id === id ? { ...med, ...updates } : med
    );
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
  }, [medications, saveMedications]);

  const deleteMedication = useCallback((id: string) => {
    const updatedMedications = medications.filter(med => med.id !== id);
    setMedications(updatedMedications);
    saveMedications(updatedMedications);
    
    const updatedReminders = reminders.filter(rem => rem.medicationId !== id);
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  }, [medications, reminders, saveMedications, saveReminders]);

  const generateDailyReminders = useCallback(() => {
    if (!user) return;
    
    const today = new Date().toISOString().split('T')[0];
    const activeMeds = medications.filter(med => med.status === 'active');
    
    const newReminders: Reminder[] = [];
    
    activeMeds.forEach(med => {
      const times = med.reminderTimes.length > 0 ? med.reminderTimes : getDefaultTimes(med.frequency);
      
      times.forEach((time, index) => {
        newReminders.push({
          id: `rem-${med.id}-${today}-${index}`,
          medicationId: med.id,
          medicationName: med.name,
          dosage: med.dosage,
          scheduledTime: time,
          status: 'upcoming',
          date: today,
        });
      });
    });
    
    setReminders(newReminders);
    saveReminders(newReminders);
  }, [user, medications, saveReminders]);

  const markReminderAsTaken = useCallback((id: string) => {
    const updatedReminders = reminders.map(rem =>
      rem.id === id ? { ...rem, status: 'taken' as const } : rem
    );
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  }, [reminders, saveReminders]);

  const snoozeReminder = useCallback((id: string, minutes: number) => {
    const updatedReminders = reminders.map(rem => {
      if (rem.id === id) {
        const [hours, mins] = rem.scheduledTime.split(':').map(Number);
        const newDate = new Date();
        newDate.setHours(hours, mins + minutes);
        const newTime = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
        return { ...rem, scheduledTime: newTime, status: 'snoozed' as const };
      }
      return rem;
    });
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  }, [reminders, saveReminders]);

  const updateNotificationSettings = useCallback((settings: Partial<NotificationSettings>) => {
    const updated = { ...notificationSettings, ...settings };
    setNotificationSettings(updated);
    if (user) {
      localStorage.setItem(`prescyra-notification-settings-${user.id}`, JSON.stringify(updated));
    }
  }, [notificationSettings, user]);

  return (
    <MedicationContext.Provider
      value={{
        medications,
        reminders,
        notificationSettings,
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
