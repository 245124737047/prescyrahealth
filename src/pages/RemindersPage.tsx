import React, { useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedication } from '@/contexts/MedicationContext';
import Header from '@/components/Header';
import {
  Bell,
  Clock,
  CheckCircle2,
  XCircle,
  AlarmClock,
  Mail,
  MessageSquare,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const RemindersPage: React.FC = () => {
  const { t } = useLanguage();
  const {
    reminders,
    notificationSettings,
    markReminderAsTaken,
    snoozeReminder,
    updateNotificationSettings,
    generateDailyReminders,
  } = useMedication();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { toast } = useToast();

  useEffect(() => {
    generateDailyReminders();
  }, []);

  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const categorizedReminders = {
    upcoming: reminders.filter(r => r.status === 'upcoming' && r.scheduledTime > currentTime),
    current: reminders.filter(r => r.status === 'upcoming' && r.scheduledTime <= currentTime),
    taken: reminders.filter(r => r.status === 'taken'),
    missed: reminders.filter(r => r.status === 'missed'),
    snoozed: reminders.filter(r => r.status === 'snoozed'),
  };

  const handleMarkTaken = (id: string) => {
    markReminderAsTaken(id);
    toast({
      title: t('success'),
      description: t('doseTaken'),
    });
  };

  const handleSnooze = (id: string) => {
    snoozeReminder(id, 15);
    toast({
      title: t('success'),
      description: 'Reminder snoozed for 15 minutes',
    });
  };

  const ReminderCard: React.FC<{
    reminder: typeof reminders[0];
    showActions?: boolean;
  }> = ({ reminder, showActions = true }) => (
    <div className={cn(
      'flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border transition-all gap-3',
      reminder.status === 'taken' && 'bg-success/5 border-success/20',
      reminder.status === 'missed' && 'bg-destructive/5 border-destructive/20',
      reminder.status === 'upcoming' && 'bg-card border-border',
      reminder.status === 'snoozed' && 'bg-warning/5 border-warning/20'
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          'w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          reminder.status === 'taken' && 'bg-success/10',
          reminder.status === 'missed' && 'bg-destructive/10',
          reminder.status === 'upcoming' && 'bg-primary/10',
          reminder.status === 'snoozed' && 'bg-warning/10'
        )}>
          {reminder.status === 'taken' ? (
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-success" />
          ) : reminder.status === 'missed' ? (
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
          ) : reminder.status === 'snoozed' ? (
            <AlarmClock className="w-5 h-5 sm:w-6 sm:h-6 text-warning" />
          ) : (
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-foreground truncate">{reminder.medicationName}</p>
          <p className="text-sm text-muted-foreground">
            {reminder.dosage} • {reminder.scheduledTime}
          </p>
        </div>
      </div>

      {showActions && reminder.status === 'upcoming' && (
        <div className="flex gap-2 ml-14 sm:ml-0">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleSnooze(reminder.id)}
            className="text-warning hover:text-warning hover:bg-warning/10"
          >
            <AlarmClock className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            onClick={() => handleMarkTaken(reminder.id)}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            <CheckCircle2 className="w-4 h-4 mr-1" />
            <span className="hidden xs:inline">{t('markAsTaken')}</span>
            <span className="xs:hidden">Done</span>
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      <Header
        title={t('medicationReminders')}
        subtitle={t('remindersSubtitle')}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Notification Settings */}
        <div className="medical-card">
          <h2 className="font-heading text-lg font-semibold mb-4">{t('notificationSettings')}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Configure how you want to receive medication reminders (simulated)
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <Label className="font-medium">{t('smsNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">Receive SMS reminders</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.sms}
                onCheckedChange={(checked) => updateNotificationSettings({ sms: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <Label className="font-medium">{t('emailNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">Receive email reminders</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.email}
                onCheckedChange={(checked) => updateNotificationSettings({ email: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-warning" />
                </div>
                <div>
                  <Label className="font-medium">{t('appNotifications')}</Label>
                  <p className="text-xs text-muted-foreground">Receive in-app notifications</p>
                </div>
              </div>
              <Switch
                checked={notificationSettings.app}
                onCheckedChange={(checked) => updateNotificationSettings({ app: checked })}
              />
            </div>
          </div>
        </div>

        {/* Current / Due Now */}
        {(categorizedReminders.current.length > 0 || categorizedReminders.snoozed.length > 0) && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5 text-warning animate-pulse-soft" />
              Due Now
            </h2>
            <div className="space-y-3">
              {[...categorizedReminders.current, ...categorizedReminders.snoozed].map((reminder, index) => (
                <div key={reminder.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <ReminderCard reminder={reminder} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Today's Schedule */}
        <div className="medical-card">
          <h2 className="font-heading text-lg font-semibold mb-4">{t('todaySchedule')}</h2>
          
          {reminders.length > 0 ? (
            <div className="space-y-6">
              {/* Upcoming */}
              {categorizedReminders.upcoming.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {t('upcoming')}
                  </p>
                  {categorizedReminders.upcoming.map((reminder, index) => (
                    <div key={reminder.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                      <ReminderCard reminder={reminder} />
                    </div>
                  ))}
                </div>
              )}

              {/* Taken */}
              {categorizedReminders.taken.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-success flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    {t('taken')}
                  </p>
                  {categorizedReminders.taken.map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} showActions={false} />
                  ))}
                </div>
              )}

              {/* Missed */}
              {categorizedReminders.missed.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-destructive flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    {t('missed')}
                  </p>
                  {categorizedReminders.missed.map(reminder => (
                    <ReminderCard key={reminder.id} reminder={reminder} showActions={false} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No reminders for today</p>
              <p className="text-sm mt-2">Add medications to generate reminders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemindersPage;
