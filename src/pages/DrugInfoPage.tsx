import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { demoMedicines } from '@/lib/demo-data';
import { DrugInfo } from '@/lib/types';
import Header from '@/components/Header';
import {
  Search,
  Pill,
  AlertTriangle,
  Shield,
  Info,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  BookOpen,
  Activity,
  AlertCircle,
  Heart,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DrugInfoPage: React.FC = () => {
  const { t } = useLanguage();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();

  const [searchQuery, setSearchQuery] = useState('');
  const [doseQuery, setDoseQuery] = useState('');
  const [searchResults, setSearchResults] = useState<DrugInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugInfo | null>(null);

  const searchOpenFDA = useCallback(async (query: string, dose: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // First check if it matches a demo medicine
    const normalizedQuery = query.toLowerCase().trim();
    const matchedDemo = demoMedicines.find(med => 
      med.name.toLowerCase().includes(normalizedQuery) ||
      med.genericName.toLowerCase().includes(normalizedQuery)
    );

    if (matchedDemo) {
      // Return demo medicine with dose context if provided
      const doseInfo = dose ? ` (Searched dose: ${dose})` : '';
      setSearchResults([{
        ...matchedDemo,
        id: `search-${matchedDemo.id}`,
        name: matchedDemo.name + doseInfo,
        isDemo: false,
      }]);
      setIsSearching(false);
      return;
    }
    
    try {
      // Search OpenFDA for drug information
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(query)}"&limit=5`
      );
      
      if (!response.ok) {
        // Try generic name search
        const genericResponse = await fetch(
          `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}"&limit=5`
        );
        
        if (!genericResponse.ok) {
          setSearchResults([]);
          setIsSearching(false);
          return;
        }
        
        const genericData = await genericResponse.json();
        processResults(genericData.results || [], dose);
        return;
      }
      
      const data = await response.json();
      processResults(data.results || [], dose);
    } catch (error) {
      console.error('Error fetching drug info:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const processResults = (results: any[], dose: string) => {
    const doseInfo = dose ? ` (Searched dose: ${dose})` : '';
    const drugs: DrugInfo[] = results.map((result, index) => ({
      id: `search-${index}`,
      name: (result.openfda?.brand_name?.[0] || result.openfda?.generic_name?.[0] || 'Unknown') + doseInfo,
      genericName: result.openfda?.generic_name?.[0] || '',
      brandNames: result.openfda?.brand_name || [],
      usage: result.indications_and_usage?.[0] || result.purpose?.[0] || 'No usage information available',
      dosageGuidance: result.dosage_and_administration?.[0]?.substring(0, 500) || undefined,
      contraindications: result.contraindications ? [result.contraindications[0]?.substring(0, 400)] : undefined,
      warnings: result.warnings ? [result.warnings[0]?.substring(0, 500)] : ['No warnings available'],
      precautions: result.precautions ? [result.precautions[0]?.substring(0, 500)] : [],
      commonSideEffects: result.adverse_reactions ? 
        [result.adverse_reactions[0]?.substring(0, 300)] : 
        ['See package insert for side effects'],
      seriousSideEffects: result.boxed_warning ? [result.boxed_warning[0]?.substring(0, 300)] : [],
      isDemo: false,
    }));
    
    setSearchResults(drugs);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchOpenFDA(searchQuery, doseQuery);
  };

  const DrugCard: React.FC<{ drug: DrugInfo }> = ({ drug }) => {
    const isExpanded = selectedDrug?.id === drug.id;

    return (
      <div
        className={cn(
          'medical-card cursor-pointer transition-all',
          isExpanded && 'ring-2 ring-primary'
        )}
        onClick={() => setSelectedDrug(isExpanded ? null : drug)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center',
              drug.isDemo ? 'bg-secondary/10' : 'bg-primary/10'
            )}>
              <Pill className={cn('w-6 h-6', drug.isDemo ? 'text-secondary' : 'text-primary')} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{drug.name}</h3>
                {drug.isDemo && (
                  <span className="flex items-center gap-1 text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3" />
                    Demo
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{drug.genericName}</p>
              {drug.category && (
                <p className="text-xs text-primary/80 mt-0.5">{drug.category}</p>
              )}
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 space-y-4 animate-fade-in">
            {/* How It Works */}
            {drug.howItWorks && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Activity className="w-4 h-4 text-primary" />
                  How It Works
                </div>
                <p className="text-sm text-muted-foreground pl-6">{drug.howItWorks}</p>
              </div>
            )}

            {/* Usage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Info className="w-4 h-4 text-primary" />
                {t('usage')}
              </div>
              <p className="text-sm text-muted-foreground pl-6">{drug.usage}</p>
            </div>

            {/* Dosage Guidance */}
            {drug.dosageGuidance && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <BookOpen className="w-4 h-4 text-secondary" />
                  Dosage Guidance
                </div>
                <p className="text-sm text-muted-foreground pl-6">{drug.dosageGuidance}</p>
              </div>
            )}

            {/* Contraindications */}
            {drug.contraindications && drug.contraindications.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  Contraindications
                </div>
                <ul className="text-sm text-muted-foreground pl-6 space-y-1">
                  {drug.contraindications.map((item, i) => (
                    <li key={i} className="list-disc ml-4">{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnings */}
            {drug.warnings.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  {t('warnings')}
                </div>
                <ul className="text-sm text-muted-foreground pl-6 space-y-1">
                  {drug.warnings.map((warning, i) => (
                    <li key={i} className="list-disc ml-4">{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precautions */}
            {drug.precautions.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Shield className="w-4 h-4 text-secondary" />
                  {t('precautions')}
                </div>
                <ul className="text-sm text-muted-foreground pl-6 space-y-1">
                  {drug.precautions.map((precaution, i) => (
                    <li key={i} className="list-disc ml-4">{precaution}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Overdose Warning */}
            {drug.overdoseWarning && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive mb-1">
                  <Heart className="w-4 h-4" />
                  Overdose Warning
                </div>
                <p className="text-sm text-destructive/80">{drug.overdoseWarning}</p>
              </div>
            )}

            {/* Side Effects */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">{t('sideEffects')}</p>
              
              {drug.commonSideEffects.length > 0 && (
                <div className="pl-6">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{t('commonSideEffects')}</p>
                  <div className="flex flex-wrap gap-2">
                    {drug.commonSideEffects.map((effect, i) => (
                      <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {drug.seriousSideEffects.length > 0 && (
                <div className="pl-6">
                  <p className="text-xs font-medium text-destructive mb-1">{t('seriousSideEffects')}</p>
                  <div className="flex flex-wrap gap-2">
                    {drug.seriousSideEffects.map((effect, i) => (
                      <span key={i} className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Header
        title={t('drugInformation')}
        subtitle={t('drugInfoSubtitle')}
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 space-y-6 animate-fade-in">
        {/* Educational Disclaimer */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground">Educational Information Only</p>
              <p className="text-xs text-muted-foreground mt-1">
                This information is for educational purposes only and is not medical advice, diagnosis, or prescription. 
                Always consult a qualified healthcare professional before taking any medication. 
                Never change your medication regimen without professional guidance.
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="medical-card">
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchMedicine')}
                  className="pl-10"
                />
              </div>
              <div className="relative w-32">
                <Input
                  value={doseQuery}
                  onChange={(e) => setDoseQuery(e.target.value)}
                  placeholder="Dose (e.g. 650mg)"
                  className="text-sm"
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">
                Enter medicine name and optional dose for detailed information
              </p>
              <Button type="submit" disabled={isSearching}>
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t('drugInfo')
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="font-heading text-lg font-semibold">{t('searchResults')}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {searchResults.map(drug => (
                <DrugCard key={drug.id} drug={drug} />
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{t('noResults')}</p>
          </div>
        )}

        {/* Demo Medicines */}
        <div className="space-y-4">
          <h2 className="font-heading text-lg font-semibold">{t('demoMedicines')}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {demoMedicines.map((drug, index) => (
              <div key={drug.id} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <DrugCard drug={drug} />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Disclaimer */}
        <div className="text-center text-xs text-muted-foreground pt-4 border-t border-border">
          <p>© 2025 Prescyra. Drug information is for educational purposes only.</p>
          <p className="mt-1">Always verify with a licensed healthcare provider before making any medical decisions.</p>
        </div>
      </div>
    </div>
  );
};

export default DrugInfoPage;