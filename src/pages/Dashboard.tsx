import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMedication } from '@/contexts/MedicationContext';
import { findInteractions } from '@/lib/demo-data';
import Header from '@/components/Header';
import {
  Pill,
  Bell,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  Calendar,
  ChevronRight,
  CheckCircle2,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const { medications, reminders, generateDailyReminders, markReminderAsTaken } = useMedication();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');

  const activeMedications = medications.filter(m => m.status === 'active');
  const todayReminders = reminders.filter(r => r.status !== 'taken');
  const interactions = findInteractions(activeMedications.map(m => m.name));
  const upcomingReminders = reminders
    .filter(r => r.status === 'upcoming')
    .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime))
    .slice(0, 4);

  useEffect(() => {
    generateDailyReminders();
  }, [medications]);

  const stats = [
    {
      label: t('activeMedications'),
      value: activeMedications.length,
      icon: Pill,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: t('todayReminders'),
      value: todayReminders.length,
      icon: Bell,
      color: 'text-secondary',
      bg: 'bg-secondary/10',
    },
    {
      label: t('interactionAlerts'),
      value: interactions.length,
      icon: AlertTriangle,
      color: interactions.length > 0 ? 'text-warning' : 'text-success',
      bg: interactions.length > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
  ];

  return (
    <div className="min-h-screen">
      <Header
        title=""
        subtitle={`${t('welcomeUser')}, ${profile?.name?.split(' ')[0] || 'User'} – ${t('dashboardSubtitle')}`}
        onMenuClick={onMenuClick}
        showBranding={true}
      />

      <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="medical-card animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.bg)}>
                    <Icon className={cn('w-6 h-6', stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="medical-card">
          <h2 className="font-heading text-lg font-semibold mb-4">{t('quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/medications">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <span>{t('addMedication')}</span>
              </Button>
            </Link>
            <Link to="/interactions">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
                  <Search className="w-5 h-5 text-warning" />
                </div>
                <span>{t('checkInteractions')}</span>
              </Button>
            </Link>
            <Link to="/reminders">
              <Button variant="outline" className="w-full justify-start gap-3 h-auto py-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <span>{t('viewSchedule')}</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Doses */}
          <div className="medical-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">{t('upcomingDoses')}</h2>
              <Link to="/reminders">
                <Button variant="ghost" size="sm" className="gap-1">
                  {t('viewSchedule')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {upcomingReminders.length > 0 ? (
              <div className="space-y-3">
                {upcomingReminders.map((reminder) => (
                  <div
                    key={reminder.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{reminder.medicationName}</p>
                        <p className="text-sm text-muted-foreground">{reminder.dosage} • {reminder.scheduledTime}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markReminderAsTaken(reminder.id)}
                      className="text-success hover:text-success hover:bg-success/10"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>{t('noMedications')}</p>
              </div>
            )}
          </div>

          {/* Interaction Alerts */}
          <div className="medical-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-lg font-semibold">{t('interactionAlerts')}</h2>
              <Link to="/interactions">
                <Button variant="ghost" size="sm" className="gap-1">
                  {t('checkInteractions')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            {interactions.length > 0 ? (
              <div className="space-y-3">
                {interactions.slice(0, 3).map((interaction) => (
                  <div
                    key={interaction.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      interaction.severity === 'severe' && 'bg-destructive/5 border-destructive/20',
                      interaction.severity === 'moderate' && 'bg-warning/5 border-warning/20',
                      interaction.severity === 'mild' && 'bg-success/5 border-success/20'
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={cn(
                          'w-5 h-5 mt-0.5',
                          interaction.severity === 'severe' && 'text-destructive',
                          interaction.severity === 'moderate' && 'text-warning',
                          interaction.severity === 'mild' && 'text-success'
                        )}
                      />
                      <div>
                        <p className="font-medium text-foreground">
                          {interaction.drug1} + {interaction.drug2}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {interaction.description}
                        </p>
                        <span
                          className={cn(
                            'status-badge mt-2',
                            interaction.severity === 'severe' && 'status-severe',
                            interaction.severity === 'moderate' && 'status-warning',
                            interaction.severity === 'mild' && 'status-active'
                          )}
                        >
                          {t(interaction.severity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-success opacity-70" />
                <p>{t('noInteractionsFound')}</p>
              </div>
            )}
          </div>
        </div>

        {/* Page Review Section */}
        <div className="medical-card">
          <h2 className="font-heading text-lg font-semibold mb-2">How do you feel about Prescyra?</h2>
          <p className="text-sm text-muted-foreground mb-4">We'd love to hear your thoughts to help us improve.</p>
          
          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Rate your overall experience</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                  >
                    <Star
                      className={cn(
                        'w-7 h-7 transition-colors',
                        (hoveredRating || rating) >= star
                          ? 'fill-primary text-primary'
                          : 'text-muted-foreground/40'
                      )}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating}/5
                  </span>
                )}
              </div>
            </div>

            {/* Feedback Text Area */}
            <div>
              <label htmlFor="feedback" className="text-sm font-medium text-foreground mb-2 block">
                Comments or feedback (optional)
              </label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="resize-none min-h-[100px]"
              />
            </div>

            <Button 
              className="w-full sm:w-auto"
              disabled={rating === 0}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
