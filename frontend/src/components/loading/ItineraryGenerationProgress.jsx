import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, IndianRupee, CheckCircle, Loader2 } from 'lucide-react';

const ItineraryGenerationProgress = ({ destination }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    { icon: MapPin, title: 'Analyzing Destination', description: `Researching ${destination || 'your destination'}...`, duration: 1500 },
    { icon: Calendar, title: 'Planning Timeline', description: 'Creating optimal day-by-day schedule...', duration: 2000 },
    { icon: Sparkles, title: 'Finding Activities', description: 'Discovering attractions and experiences...', duration: 2500 },
    { icon: IndianRupee, title: 'Optimizing Budget', description: 'Balancing cost with experience quality...', duration: 2000 },
    { icon: CheckCircle, title: 'Finalizing Itinerary', description: 'Compiling your personalized travel plan...', duration: 1500 }
  ];

  useEffect(() => {
    let timeout;
    const processStep = (stepIndex) => {
      if (stepIndex >= steps.length) return;
      setCurrentStep(stepIndex);
      timeout = setTimeout(() => {
        setCompletedSteps(prev => new Set([...prev, stepIndex]));
        processStep(stepIndex + 1);
      }, steps[stepIndex].duration);
    };
    processStep(0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-maroon-500 to-maroon-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-warm-dark dark:text-white mb-2">Creating Your Perfect Trip</h2>
        <p className="text-brown-600 dark:text-night-muted">Our AI is crafting a personalized itinerary just for you</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isPending = index > currentStep;

          return (
            <div key={index} className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
              isCurrent
                ? 'bg-gradient-to-r from-maroon-50/80 to-maroon-100/80 dark:from-maroon-900/20 dark:to-maroon-900/20 backdrop-blur-sm border-2 border-maroon-300 dark:border-maroon-600 shadow-glass'
                : isCompleted
                ? 'bg-beige-50/80 dark:bg-beige-900/20 backdrop-blur-sm border border-beige-200 dark:border-beige-800'
                : 'bg-cream-50/50 dark:bg-night-surface/50 backdrop-blur-sm border border-cream-100 dark:border-night-border opacity-50'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCurrent ? 'bg-gradient-to-br from-maroon-500 to-maroon-600 shadow-lg animate-pulse'
                : isCompleted ? 'bg-brown-500'
                : 'bg-cream-300 dark:bg-night-border'
              }`}>
                {isPending ? <div className="w-4 h-4 rounded-full bg-cream-400 dark:text-night-muted" />
                : isCompleted ? <CheckCircle className="w-6 h-6 text-white" />
                : <Icon className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isCurrent ? 'text-warm-dark dark:text-white' : isCompleted ? 'text-brown-700 dark:text-beige-400' : 'text-cream-500 dark:text-night-muted'}`}>{step.title}</h3>
                <p className={`text-sm ${isCurrent ? 'text-brown-600 dark:text-night-muted' : isCompleted ? 'text-brown-600 dark:text-beige-500' : 'text-cream-400 dark:text-night-muted'}`}>{step.description}</p>
              </div>
              {isCurrent && <Loader2 className="w-5 h-5 text-maroon-600 dark:text-maroon-400 animate-spin" />}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-cream-50/80 dark:bg-night-surface/80 backdrop-blur-sm rounded-full border border-cream-100 dark:border-night-border">
          <Loader2 className="w-4 h-4 text-maroon-600 dark:text-maroon-400 animate-spin mr-2" />
          <span className="text-sm text-brown-600 dark:text-night-muted">This usually takes 10-15 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerationProgress;
