import React, { useState, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMedication } from '@/contexts/MedicationContext';
import { findInteractions, demoInteractions } from '@/lib/demo-data';
import { DrugInteraction } from '@/lib/types';
import Header from '@/components/Header';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Pill,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const InteractionsPage: React.FC = () => {
  const { t } = useLanguage();
  const { medications } = useMedication();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();

  const [customDrugs, setCustomDrugs] = useState<string[]>([]);
  const [newDrug, setNewDrug] = useState('');

  const activeMedications = medications.filter(m => m.status === 'active');
  const allDrugsToCheck = [...activeMedications.map(m => m.name), ...customDrugs];
  
  const interactions = useMemo(() => {
    return findInteractions(allDrugsToCheck);
  }, [allDrugsToCheck]);

  const handleAddDrug = () => {
    if (newDrug.trim() && !customDrugs.includes(newDrug.trim())) {
      setCustomDrugs(prev => [...prev, newDrug.trim()]);
      setNewDrug('');
    }
  };

  const handleRemoveDrug = (drug: string) => {
    setCustomDrugs(prev => prev.filter(d => d !== drug));
  };

  const getSeverityColor = (severity: DrugInteraction['severity']) => {
    switch (severity) {
      case 'severe':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'moderate':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'mild':
        return 'bg-success/10 border-success/30 text-success';
    }
  };

  const getSeverityIcon = (severity: DrugInteraction['severity']) => {
    switch (severity) {
      case 'severe':
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case 'moderate':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'mild':
        return <Shield className="w-5 h-5 text-success" />;
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title={t('interactionChecker')}
        subtitle={t('interactionsSubtitle')}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Drug List */}
        <div className="medical-card">
          <h2 className="font-heading text-lg font-semibold mb-4">{t('medications')}</h2>
          
          {/* Active Medications */}
          <div className="space-y-3 mb-4">
            <p className="text-sm text-muted-foreground">{t('activeMedications')}</p>
            <div className="flex flex-wrap gap-2">
              {activeMedications.map(med => (
                <div
                  key={med.id}
                  className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm"
                >
                  <Pill className="w-4 h-4" />
                  {med.name}
                </div>
              ))}
              {activeMedications.length === 0 && (
                <p className="text-sm text-muted-foreground italic">No active medications</p>
              )}
            </div>
          </div>

          {/* Custom Drugs */}
          {customDrugs.length > 0 && (
            <div className="space-y-3 mb-4">
              <p className="text-sm text-muted-foreground">Additional drugs to check</p>
              <div className="flex flex-wrap gap-2">
                {customDrugs.map(drug => (
                  <div
                    key={drug}
                    className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-sm"
                  >
                    <Pill className="w-4 h-4" />
                    {drug}
                    <button
                      onClick={() => handleRemoveDrug(drug)}
                      className="ml-1 hover:text-destructive transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add Drug */}
          <div className="flex gap-2">
            <Input
              value={newDrug}
              onChange={(e) => setNewDrug(e.target.value)}
              placeholder="Add a drug to check interactions..."
              onKeyDown={(e) => e.key === 'Enter' && handleAddDrug()}
            />
            <Button onClick={handleAddDrug} disabled={!newDrug.trim()}>
              Add
            </Button>
          </div>
        </div>

        {/* Interaction Results */}
        {allDrugsToCheck.length >= 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                {interactions.length > 0 ? t('interactionsFound') : t('noInteractionsFound')}
              </h2>
              <span className={cn(
                'status-badge',
                interactions.length > 0 ? 'status-warning' : 'status-active'
              )}>
                {interactions.length} {t('interactionAlerts')}
              </span>
            </div>

            {interactions.length > 0 ? (
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div
                    key={interaction.id}
                    className={cn(
                      'medical-card border-l-4 animate-slide-up',
                      getSeverityColor(interaction.severity)
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      {getSeverityIcon(interaction.severity)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">{interaction.drug1}</span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" />
                          <span className="font-semibold text-foreground">{interaction.drug2}</span>
                        </div>
                        
                        <span className={cn(
                          'status-badge mb-3 inline-block',
                          interaction.severity === 'severe' && 'status-severe',
                          interaction.severity === 'moderate' && 'status-warning',
                          interaction.severity === 'mild' && 'status-active'
                        )}>
                          {t(interaction.severity)} {t('severity')}
                        </span>

                        <div className="space-y-3 mt-3">
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">{t('description')}</p>
                            <p className="text-sm text-muted-foreground">{interaction.description}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground mb-1">{t('recommendation')}</p>
                            <p className="text-sm text-muted-foreground">{interaction.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="medical-card text-center py-12">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-success" />
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {t('noInteractionsFound')}
                </h3>
                <p className="text-muted-foreground">
                  No known interactions between your current medications
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info when not enough drugs */}
        {allDrugsToCheck.length < 2 && (
          <div className="medical-card text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
              {t('checkInteractions')}
            </h3>
            <p className="text-muted-foreground">
              Add at least 2 medications to check for interactions
            </p>
          </div>
        )}

        {/* All Known Interactions Reference */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">Known Interaction Database</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoInteractions.map((interaction, index) => (
              <div
                key={interaction.id}
                className={cn(
                  'medical-card border-l-4 animate-slide-up',
                  getSeverityColor(interaction.severity)
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getSeverityIcon(interaction.severity)}
                  <span className="font-medium text-foreground">
                    {interaction.drug1} + {interaction.drug2}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {interaction.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractionsPage;
