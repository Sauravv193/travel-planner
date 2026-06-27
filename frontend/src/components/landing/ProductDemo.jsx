import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, DollarSign, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ProductDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const demoSteps = [
    {
      step: 0,
      title: "Enter Your Destination",
      icon: MapPin,
      input: "Tokyo, Japan",
      description: "Start by telling us where you want to go"
    },
    {
      step: 1,
      title: "Set Your Budget",
      icon: DollarSign,
      input: "Standard (¥15,000-30,000/day)",
      description: "Choose your spending range for the trip"
    },
    {
      step: 2,
      title: "Select Travel Style",
      icon: Sparkles,
      input: "Culture & Food Explorer",
      description: "Let us know your travel preferences"
    },
    {
      step: 3,
      title: "AI Generates Your Plan",
      icon: Clock,
      showItinerary: true,
      description: "Watch as AI creates your personalized itinerary"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % demoSteps.length);
    }, 3500);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (currentStep < 3) {
      setIsTyping(true);
      setTypedText('');
      
      const targetText = demoSteps[currentStep].input;
      let index = 0;
      
      const typeInterval = setInterval(() => {
        if (index < targetText.length) {
          setTypedText(prev => prev + targetText[index]);
          index++;
        } else {
          setIsTyping(false);
          clearInterval(typeInterval);
        }
      }, 50);
      
      return () => clearInterval(typeInterval);
    }
  }, [currentStep]);

  const currentDemo = demoSteps[currentStep];
  const Icon = currentDemo.icon;

  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-pink-400 to-pink-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
          <div className="text-white text-sm font-medium">WanderGen Demo</div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="p-8">
        {currentStep < 3 ? (
          /* Input Steps */
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{currentDemo.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{currentDemo.description}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border-2 border-pink-200 dark:border-pink-800">
              <div className="flex items-center space-x-2 text-gray-900 dark:text-white font-mono">
                {isTyping && <span className="animate-pulse">▌</span>}
                <span>{typedText}</span>
              </div>
            </div>

            {/* Progress Indicators */}
            <div className="flex justify-center space-x-2">
              {demoSteps.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentStep
                      ? 'w-8 bg-pink-600'
                      : index < currentStep
                      ? 'w-2 bg-pink-400'
                      : 'w-2 bg-gray-300 dark:bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Itinerary Preview */
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg animate-pulse">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Your Tokyo Adventure</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">5-day personalized itinerary ready</p>
              </div>
            </div>

            {/* Mini Itinerary Cards */}
            <div className="space-y-3">
              {[
                { day: "Day 1", activity: "Explore Shibuya & Harajuku", time: "9:00 AM" },
                { day: "Day 2", activity: "Senso-ji Temple & Asakusa", time: "8:30 AM" },
                { day: "Day 3", activity: "TeamLab Borderless Museum", time: "10:00 AM" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700 transform transition-all duration-500"
                  style={{
                    opacity: index === 0 ? 1 : 0.5,
                    transform: index === 0 ? 'translateX(0)' : 'translateX(-10px)'
                  }}
                >
                  <div className="w-8 h-8 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.day} • {item.time}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.activity}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <div className="flex items-center space-x-2 text-pink-600 dark:text-pink-400 font-medium text-sm">
                <span>And much more...</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Footer */}
      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Step {currentStep + 1} of {demoSteps.length}</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Demo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDemo;