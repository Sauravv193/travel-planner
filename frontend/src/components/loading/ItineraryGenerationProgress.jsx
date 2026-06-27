import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, CheckCircle, Loader2 } from 'lucide-react';

const ItineraryGenerationProgress = ({ destination }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const steps = [
    {
      icon: MapPin,
      title: 'Analyzing Destination',
      description: `Researching ${destination || 'your destination'}...`,
      duration: 1500
    },
    {
      icon: Calendar,
      title: 'Planning Timeline',
      description: 'Creating optimal day-by-day schedule...',
      duration: 2000
    },
    {
      icon: Sparkles,
      title: 'Finding Activities',
      description: 'Discovering attractions and experiences...',
      duration: 2500
    },
    {
      icon: DollarSign,
      title: 'Optimizing Budget',
      description: 'Balancing cost with experience quality...',
      duration: 2000
    },
    {
      icon: CheckCircle,
      title: 'Finalizing Itinerary',
      description: 'Compiling your personalized travel plan...',
      duration: 1500
    }
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
        <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Creating Your Perfect Trip
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Our AI is crafting a personalized itinerary just for you
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCurrent = index === currentStep;
          const isCompleted = completedSteps.has(index);
          const isPending = index > currentStep;

          return (
            <div
              key={index}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                isCurrent
                  ? 'bg-gradient-to-r from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-900/20 border-2 border-pink-300 dark:border-pink-600 shadow-md'
                  : isCompleted
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                isCurrent
                  ? 'bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg animate-pulse'
                  : isCompleted
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}>
                {isPending ? (
                  <div className="w-4 h-4 rounded-full bg-gray-400 dark:bg-gray-500" />
                ) : isCompleted ? (
                  <CheckCircle className="w-6 h-6 text-white" />
                ) : (
                  <Icon className="w-6 h-6 text-white" />
                )}
              </div>
              
              <div className="flex-1">
                <h3 className={`font-semibold ${
                  isCurrent
                    ? 'text-gray-900 dark:text-white'
                    : isCompleted
                    ? 'text-green-700 dark:text-green-400'
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm ${
                  isCurrent
                    ? 'text-gray-600 dark:text-gray-300'
                    : isCompleted
                    ? 'text-green-600 dark:text-green-500'
                    : 'text-gray-400 dark:text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>

              {isCurrent && (
                <Loader2 className="w-5 h-5 text-pink-600 dark:text-pink-400 animate-spin" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full">
          <Loader2 className="w-4 h-4 text-pink-600 dark:text-pink-400 animate-spin mr-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            This usually takes 10-15 seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryGenerationProgress;