import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import {
  User,
  Heart,
  AlertCircle,
  Phone,
  Save,
  Plus,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const ProfilePage: React.FC = () => {
  const { t } = useLanguage();
  const { profile, updateProfile } = useAuth();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    age: profile?.age || 0,
    gender: profile?.gender || 'other',
    bloodType: profile?.bloodType || '',
    emergencyContact: profile?.emergencyContact || '',
    phoneNumber: profile?.phoneNumber || '',
    allergies: profile?.allergies || [],
    medicalConditions: profile?.medicalConditions || [],
  });

  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    toast({
      title: t('success'),
      description: t('profileUpdated'),
    });
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()],
      }));
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy),
    }));
  };

  const addCondition = () => {
    if (newCondition.trim() && !formData.medicalConditions.includes(newCondition.trim())) {
      setFormData(prev => ({
        ...prev,
        medicalConditions: [...prev.medicalConditions, newCondition.trim()],
      }));
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: prev.medicalConditions.filter(c => c !== condition),
    }));
  };

  return (
    <div className="min-h-screen">
      <Header
        title={t('patientProfile')}
        subtitle={t('profileSubtitle')}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 animate-fade-in">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-6">
          {/* Personal Information */}
          <div className="medical-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-lg font-semibold">{t('personalInfo')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('fullName')}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">{t('age')}</Label>
                <Input
                  id="age"
                  type="number"
                  min="0"
                  max="150"
                  value={formData.age || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('gender')}</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{t('male')}</SelectItem>
                    <SelectItem value="female">{t('female')}</SelectItem>
                    <SelectItem value="other">{t('other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{t('bloodType')}</Label>
                <Select
                  value={formData.bloodType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, bloodType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('selectOption')} />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="medical-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Heart className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="font-heading text-lg font-semibold">{t('medicalHistory')}</h2>
            </div>

            <div className="space-y-6">
              {/* Medical Conditions */}
              <div className="space-y-3">
                <Label>{t('conditions')}</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="e.g., Diabetes, Hypertension"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCondition())}
                  />
                  <Button type="button" variant="outline" onClick={addCondition}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.medicalConditions.map(condition => (
                    <div
                      key={condition}
                      className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm"
                    >
                      {condition}
                      <button
                        type="button"
                        onClick={() => removeCondition(condition)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Allergies */}
          <div className="medical-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
              <h2 className="font-heading text-lg font-semibold">{t('allergies')}</h2>
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={newAllergy}
                  onChange={(e) => setNewAllergy(e.target.value)}
                  placeholder="e.g., Penicillin, Peanuts"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addAllergy())}
                />
                <Button type="button" variant="outline" onClick={addAllergy}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.allergies.map(allergy => (
                  <div
                    key={allergy}
                    className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1.5 rounded-full text-sm"
                  >
                    {allergy}
                    <button
                      type="button"
                      onClick={() => removeAllergy(allergy)}
                      className="hover:text-destructive transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="medical-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-destructive" />
              </div>
              <h2 className="font-heading text-lg font-semibold">{t('emergencyContact')}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">{t('fullName')}</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Contact name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">{t('phoneNumber')}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              <Save className="w-4 h-4" />
              {t('saveChanges')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
