import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const FeedbackPage: React.FC = () => {
  const { t } = useLanguage();
  const { onMenuClick } = useOutletContext<{ onMenuClick: () => void }>();
  const { toast } = useToast();
  
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = () => {
    if (rating === 0) return;
    
    // Here you could save to database
    setIsSubmitted(true);
    toast({
      title: "Thank you for your feedback!",
      description: "Your response has been recorded.",
    });
  };

  const ratingLabels = [
    '',
    'Poor',
    'Fair',
    'Good',
    'Very Good',
    'Excellent'
  ];

  return (
    <div className="min-h-screen">
      <Header
        title="Feedback"
        subtitle="Help us improve your experience"
        onMenuClick={onMenuClick}
      />

      <div className="p-4 sm:p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="medical-card">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                  How do you feel about Prescyra?
                </h2>
                <p className="text-muted-foreground">
                  Your feedback helps us create a better experience for everyone.
                </p>
              </div>

              <div className="space-y-8">
                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground mb-4">
                    Rate your overall experience
                  </p>
                  <div className="flex items-center justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="p-2 transition-transform hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded-full"
                      >
                        <Star
                          className={cn(
                            'w-10 h-10 transition-colors',
                            (hoveredRating || rating) >= star
                              ? 'fill-primary text-primary'
                              : 'text-muted-foreground/30'
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  {(hoveredRating || rating) > 0 && (
                    <p className="mt-3 text-sm font-medium text-primary">
                      {ratingLabels[hoveredRating || rating]}
                    </p>
                  )}
                </div>

                {/* Feedback Text Area */}
                <div>
                  <label htmlFor="feedback" className="text-sm font-medium text-foreground mb-2 block">
                    Comments or suggestions (optional)
                  </label>
                  <Textarea
                    id="feedback"
                    placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="resize-none min-h-[140px]"
                  />
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  size="lg"
                  disabled={rating === 0}
                >
                  Submit Feedback
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
                <Star className="w-10 h-10 text-success fill-success" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
                Thank You!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your feedback has been submitted successfully.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setRating(0);
                  setFeedback('');
                }}
              >
                Submit Another Response
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;