export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PatientProfile {
  userId: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  allergies: string[];
  medicalConditions: string[];
  emergencyContact: string;
  phoneNumber: string;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: 'once' | 'twice' | 'thrice' | 'every4h' | 'every6h' | 'every8h' | 'asNeeded';
  duration: string;
  startDate: string;
  endDate: string;
  instructions: string;
  status: 'active' | 'completed' | 'paused';
  reminderTimes: string[];
}

export interface DrugInfo {
  id: string;
  name: string;
  genericName: string;
  brandNames: string[];
  usage: string;
  warnings: string[];
  precautions: string[];
  commonSideEffects: string[];
  seriousSideEffects: string[];
  isDemo: boolean;
}

export interface DrugInteraction {
  id: string;
  drug1: string;
  drug2: string;
  severity: 'mild' | 'moderate' | 'severe';
  description: string;
  recommendation: string;
}

export interface Reminder {
  id: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'upcoming' | 'taken' | 'missed' | 'snoozed';
  date: string;
}

export interface NotificationSettings {
  sms: boolean;
  email: boolean;
  app: boolean;
}
