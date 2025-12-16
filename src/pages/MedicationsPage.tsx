import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedication } from '@/contexts/MedicationContext';
import { Medication } from '@/lib/types';
import Header from '@/components/Header';
import {
  Plus,
  Pill,
  Edit2,
  Trash2,
  X,
  Calendar,
  Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MedicationsPage: React.FC = () => {
  const { t } = useLanguage();
  const { medications, addMedication, updateMedication, deleteMedication } = useMedication();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'once' as Medication['frequency'],
    duration: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
    status: 'active' as Medication['status'],
    reminderTimes: ['08:00'],
  });

  const frequencyOptions = [
    { value: 'once', label: t('onceDaily') },
    { value: 'twice', label: t('twiceDaily') },
    { value: 'thrice', label: t('thriceDaily') },
    { value: 'every4h', label: t('everyHours', { hours: 4 }) },
    { value: 'every6h', label: t('everyHours', { hours: 6 }) },
    { value: 'every8h', label: t('everyHours', { hours: 8 }) },
    { value: 'asNeeded', label: t('asNeeded') },
  ];

  const handleOpenDialog = (medication?: Medication) => {
    if (medication) {
      setEditingMedication(medication);
      setFormData({
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        duration: medication.duration,
        startDate: medication.startDate,
        endDate: medication.endDate,
        instructions: medication.instructions,
        status: medication.status,
        reminderTimes: medication.reminderTimes,
      });
    } else {
      setEditingMedication(null);
      setFormData({
        name: '',
        dosage: '',
        frequency: 'once',
        duration: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        instructions: '',
        status: 'active',
        reminderTimes: ['08:00'],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.dosage) {
      toast({
        title: t('error'),
        description: 'Please fill in required fields',
        variant: 'destructive',
      });
      return;
    }

    if (editingMedication) {
      updateMedication(editingMedication.id, formData);
      toast({
        title: t('success'),
        description: t('medicationUpdated'),
      });
    } else {
      addMedication(formData);
      toast({
        title: t('success'),
        description: t('medicationAdded'),
      });
    }

    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteMedication(id);
    toast({
      title: t('success'),
      description: t('medicationDeleted'),
    });
  };

  const addReminderTime = () => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: [...prev.reminderTimes, '08:00'],
    }));
  };

  const updateReminderTime = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.map((t, i) => (i === index ? value : t)),
    }));
  };

  const removeReminderTime = (index: number) => {
    setFormData(prev => ({
      ...prev,
      reminderTimes: prev.reminderTimes.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen">
      <Header
        title={t('myMedications')}
        subtitle={t('medicationsSubtitle')}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        <div className="flex justify-end">
          <Button onClick={() => handleOpenDialog()} className="gap-2">
            <Plus className="w-4 h-4" />
            {t('addNewMedication')}
          </Button>
        </div>

        {medications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {medications.map((medication, index) => (
              <div
                key={medication.id}
                className="medical-card animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{medication.name}</h3>
                      <p className="text-sm text-muted-foreground">{medication.dosage}</p>
                    </div>
                  </div>
                  <span
                    className={cn(
                      'status-badge',
                      medication.status === 'active' && 'status-active',
                      medication.status === 'paused' && 'status-warning',
                      medication.status === 'completed' && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {t(medication.status)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{frequencyOptions.find(f => f.value === medication.frequency)?.label}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{medication.startDate} - {medication.endDate || 'Ongoing'}</span>
                  </div>
                </div>

                {medication.instructions && (
                  <p className="mt-3 text-sm text-muted-foreground border-t border-border pt-3">
                    {medication.instructions}
                  </p>
                )}

                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => handleOpenDialog(medication)}
                  >
                    <Edit2 className="w-4 h-4" />
                    {t('edit')}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleDelete(medication.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="medical-card text-center py-12">
            <Pill className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              {t('noMedications')}
            </h3>
            <p className="text-muted-foreground mb-4">
              Start by adding your first medication
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              {t('addNewMedication')}
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading">
              {editingMedication ? t('editMedication') : t('addNewMedication')}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('medicineName')} *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Aspirin"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">{t('dosage')} *</Label>
                <Input
                  id="dosage"
                  value={formData.dosage}
                  onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                  placeholder="e.g., 500mg"
                />
              </div>
              <div className="space-y-2">
                <Label>{t('frequency')}</Label>
                <Select
                  value={formData.frequency}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as Medication['frequency'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('startDate')}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">{t('endDate')}</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>{t('reminderTime')}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={addReminderTime}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {formData.reminderTimes.map((time, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateReminderTime(index, e.target.value)}
                    />
                    {formData.reminderTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeReminderTime(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">{t('instructions')}</Label>
              <Textarea
                id="instructions"
                value={formData.instructions}
                onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="e.g., Take with food"
                rows={3}
              />
            </div>

            {editingMedication && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Medication['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t('active')}</SelectItem>
                    <SelectItem value="paused">{t('paused')}</SelectItem>
                    <SelectItem value="completed">{t('completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setIsDialogOpen(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" className="flex-1">
                {t('save')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationsPage;
