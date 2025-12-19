import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, X, Heart, Pill, MessageSquare, CheckCircle } from 'lucide-react';

interface DemoProfile {
  id: number;
  fullName: string;
  age: number;
  gender: string;
  userType: string;
  healthContext: string;
  medicationQuery: string;
  platformInteraction: string;
  outcome: string;
}

const demoProfiles: DemoProfile[] = [
  {
    id: 1,
    fullName: 'Maria Santos',
    age: 67,
    gender: 'Female',
    userType: 'Senior Patient',
    healthContext: 'Type 2 diabetes, hypertension, mild arthritis',
    medicationQuery: 'Checking interactions between Metformin and new pain reliever',
    platformInteraction: 'Daily medication reminders, drug interaction checks',
    outcome: 'Improved medication adherence by 40%, avoided potential drug interaction',
  },
  {
    id: 2,
    fullName: 'James Chen',
    age: 34,
    gender: 'Male',
    userType: 'Caregiver',
    healthContext: 'Managing medications for elderly mother with dementia',
    medicationQuery: 'Setting up medication schedule for multiple prescriptions',
    platformInteraction: 'Multi-user management, reminder notifications',
    outcome: 'Reduced missed doses from 8 per week to 1, simplified care routine',
  },
  {
    id: 3,
    fullName: 'Aisha Patel',
    age: 28,
    gender: 'Female',
    userType: 'Young Professional',
    healthContext: 'Anxiety disorder, occasional migraines',
    medicationQuery: 'Understanding side effects of new anxiety medication',
    platformInteraction: 'Drug information lookup, symptom tracking',
    outcome: 'Better informed about medication effects, reduced anxiety about treatment',
  },
  {
    id: 4,
    fullName: 'Robert Williams',
    age: 55,
    gender: 'Male',
    userType: 'Chronic Condition Patient',
    healthContext: 'Heart disease, high cholesterol, sleep apnea',
    medicationQuery: 'Coordinating 6 different daily medications',
    platformInteraction: 'Complex schedule management, refill reminders',
    outcome: 'Streamlined medication routine, never missed cardio medications',
  },
  {
    id: 5,
    fullName: 'Elena Rodriguez',
    age: 42,
    gender: 'Female',
    userType: 'Parent',
    healthContext: 'Managing children\'s medications and own hypothyroidism',
    medicationQuery: 'Child-safe dosing information for cold medicine',
    platformInteraction: 'Family medication profiles, pediatric drug info',
    outcome: 'Confident in children\'s medication management, avoided overdosing risks',
  },
  {
    id: 6,
    fullName: 'Michael Thompson',
    age: 71,
    gender: 'Male',
    userType: 'Post-Surgery Patient',
    healthContext: 'Recovering from hip replacement surgery',
    medicationQuery: 'Understanding temporary pain management protocol',
    platformInteraction: 'Tapering schedule reminders, recovery tracking',
    outcome: 'Smooth transition off pain medications, successful recovery',
  },
  {
    id: 7,
    fullName: 'Sarah Kim',
    age: 31,
    gender: 'Female',
    userType: 'Pregnant Patient',
    healthContext: 'First pregnancy, gestational diabetes',
    medicationQuery: 'Checking pregnancy safety of all current medications',
    platformInteraction: 'Pregnancy-safe drug verification, glucose monitoring reminders',
    outcome: 'Peace of mind about medication safety, healthy pregnancy progress',
  },
  {
    id: 8,
    fullName: 'David Okonkwo',
    age: 45,
    gender: 'Male',
    userType: 'Travel Professional',
    healthContext: 'Asthma, frequent travel across time zones',
    medicationQuery: 'Adjusting medication schedule for international travel',
    platformInteraction: 'Time zone adjustment, travel medication checklist',
    outcome: 'Maintained consistent medication schedule despite travel, reduced asthma incidents',
  },
  {
    id: 9,
    fullName: 'Linda Foster',
    age: 58,
    gender: 'Female',
    userType: 'Cancer Survivor',
    healthContext: 'Breast cancer in remission, on hormone therapy',
    medicationQuery: 'Long-term hormone therapy adherence and supplement interactions',
    platformInteraction: 'Long-term therapy tracking, oncology medication info',
    outcome: 'Consistent adherence to prevention protocol, caught a supplement interaction early',
  },
  {
    id: 10,
    fullName: 'Thomas Anderson',
    age: 39,
    gender: 'Male',
    userType: 'Mental Health Patient',
    healthContext: 'Bipolar disorder, currently stable on medication',
    medicationQuery: 'Monitoring mood stabilizer effectiveness and timing',
    platformInteraction: 'Mood tracking integration, precise timing reminders',
    outcome: 'Longest stable period in 5 years, better quality of life',
  },
];

const DemoProfilesPage: React.FC = () => {
  const [selectedProfile, setSelectedProfile] = useState<DemoProfile | null>(null);

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-2">
            Demo User Profiles
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore how different types of users benefit from Prescyra's medication management platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {demoProfiles.map((profile) => (
            <Card
              key={profile.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-card border-border"
              onClick={() => setSelectedProfile(profile)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base font-semibold text-foreground">
                      {profile.fullName}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {profile.age} years old
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                  {profile.userType}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detail Modal */}
        {selectedProfile && (
          <div 
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedProfile(null)}
          >
            <Card 
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="border-b border-border">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-foreground">
                        {selectedProfile.fullName}
                      </CardTitle>
                      <p className="text-muted-foreground">
                        {selectedProfile.age} years old • {selectedProfile.gender}
                      </p>
                      <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                        {selectedProfile.userType}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedProfile(null)}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Health Context</h4>
                    <p className="text-muted-foreground">{selectedProfile.healthContext}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Pill className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Medication Query</h4>
                    <p className="text-muted-foreground">{selectedProfile.medicationQuery}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-medical-blue mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Platform Interaction</h4>
                    <p className="text-muted-foreground">{selectedProfile.platformInteraction}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Outcome</h4>
                    <p className="text-muted-foreground">{selectedProfile.outcome}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoProfilesPage;
