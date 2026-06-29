import { useState, useEffect } from 'react';
import { Sparkles, MapPin, Calendar, IndianRupee, Clock, CheckCircle, ArrowRight } from 'lucide-react';

const ProductDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [typedText, setTypedText] = useState('');
  
  const demoSteps = [
    {
      step: 0,
      title: "Enter Your Destination",
      icon: MapPin,
      input: "Goa, India",
      description: "Start by telling us where you want to go"
    },
    {
      step: 1,
      title: "Set Your Budget",
      icon: IndianRupee,
      input: "Standard (₹10,000-20,000/day)",
      description: "Choose your spending range for the trip"
    },
    {
      step: 2,
      title: "Select Travel Style",
      icon: Sparkles,
      input: "Beaches & Culture Explorer",
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
    <div className="relative bg-white dark:bg-night-card rounded-2xl shadow-2xl overflow-hidden border border-cream-200 dark:border-night-border shadow-gold-500/5">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-lux-navy to-lux-navy px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
            <div className="w-3 h-3 bg-white/30 rounded-full"></div>
          </div>
          <div className="text-white text-sm font-medium tracking-wide">WanderGen Demo</div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-lux-charcoal dark:text-white">{currentDemo.title}</h3>
                <p className="text-lux-taupe dark:text-night-muted text-sm">{currentDemo.description}</p>
              </div>
            </div>

            <div className="bg-cream-100 dark:bg-night-surface rounded-xl p-4 border-2 border-gold-200 dark:border-gold-500/30">
              <div className="flex items-center space-x-2 text-lux-charcoal dark:text-night-text font-mono">
                {isTyping && <span className="animate-pulse text-gold-500">▌</span>}
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
                      ? 'w-8 bg-gold-500'
                      : index < currentStep
                      ? 'w-2 bg-gold-400'
                      : 'w-2 bg-cream-300 dark:bg-night-border'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          /* Itinerary Preview */
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-xl flex items-center justify-center shadow-lg shadow-gold-500/20 animate-pulse">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-lux-charcoal dark:text-white">Your Goa Adventure</h3>
                <p className="text-lux-taupe dark:text-night-muted text-sm">5-day personalized itinerary ready</p>
              </div>
            </div>

            {/* Mini Itinerary Cards */}
            <div className="space-y-3">
              {[
                { day: "Day 1", activity: "Explore Baga & Calangute Beaches", time: "9:00 AM" },
                { day: "Day 2", activity: "Old Goa Churches & Portuguese Heritage", time: "8:30 AM" },
                { day: "Day 3", activity: "Dudhsagar Waterfalls & Spice Plantation", time: "7:00 AM" }
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-cream-50 dark:bg-night-surface rounded-lg p-3 border border-cream-200 dark:border-night-border transform transition-all duration-500"
                  style={{
                    opacity: index === 0 ? 1 : 0.5,
                    transform: index === 0 ? 'translateX(0)' : 'translateX(-10px)'
                  }}
                >
                  <div className="w-8 h-8 bg-gold-100 dark:bg-gold-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gold-600 dark:text-gold-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-lux-taupe dark:text-night-muted">{item.day} • {item.time}</div>
                    <div className="text-sm font-medium text-lux-charcoal dark:text-white">{item.activity}</div>
                  </div>
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center">
              <div className="flex items-center space-x-2 text-gold-600 dark:text-gold-400 font-medium text-sm">
                <span>And much more...</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Demo Footer */}
      <div className="bg-cream-50 dark:bg-night-surface px-6 py-3 border-t border-cream-200 dark:border-night-border">
        <div className="flex items-center justify-between text-xs text-lux-taupe dark:text-night-muted">
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