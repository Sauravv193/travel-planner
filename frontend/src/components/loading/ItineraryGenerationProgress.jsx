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
        <div className="w-20 h-20 bg-gradient-to-br from-terracotta-500 to-terracotta-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-forest-800 dark:text-white mb-2">Creating Your Perfect Trip</h2>
        <p className="text-earth-600 dark:text-night-muted">Our AI is crafting a personalized itinerary just for you</p>
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
                ? 'bg-gradient-to-r from-terracotta-50/80 to-terracotta-100/80 dark:from-terracotta-900/20 dark:to-terracotta-900/20 backdrop-blur-sm border-2 border-terracotta-300 dark:border-terracotta-600 shadow-glass'
                : isCompleted
                ? 'bg-sage-50/80 dark:bg-sage-900/20 backdrop-blur-sm border border-sage-200 dark:border-sage-800'
                : 'bg-earth-50/50 dark:bg-night-surface/50 backdrop-blur-sm border border-earth-100 dark:border-night-border opacity-50'
            }`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCurrent ? 'bg-gradient-to-br from-terracotta-500 to-terracotta-600 shadow-lg animate-pulse'
                : isCompleted ? 'bg-sage-500'
                : 'bg-earth-300 dark:bg-night-border'
              }`}>
                {isPending ? <div className="w-4 h-4 rounded-full bg-earth-400 dark:bg-night-muted" />
                : isCompleted ? <CheckCircle className="w-6 h-6 text-white" />
                : <Icon className="w-6 h-6 text-white" />}
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${isCurrent ? 'text-forest-800 dark:text-white' : isCompleted ? 'text-sage-700 dark:text-sage-400' : 'text-earth-500 dark:text-night-muted'}`}>{step.title}</h3>
                <p className={`text-sm ${isCurrent ? 'text-earth-600 dark:text-night-muted' : isCompleted ? 'text-sage-600 dark:text-sage-500' : 'text-earth-400 dark:text-night-muted'}`}>{step.description}</p>
              </div>
              {isCurrent && <Loader2 className="w-5 h-5 text-terracotta-600 dark:text-terracotta-400 animate-spin" />}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-earth-50/80 dark:bg-night-surface/80 backdrop-blur-sm rounded-full border border-earth-100 dark:border-night-border">
          <Loader2 className="w-4 h-4 text-terracotta-600 dark:text-terracotta-400 animate-spin mr-2" />
          <span className="text-sm text-earth-600 dark:text-night-muted">This usually takes 10-15 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerationProgress;