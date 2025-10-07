import { Link } from 'react-router-dom';
import { MapPin, Compass, Camera, Sparkles, Map, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Rotate features every 4 seconds
    const interval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % 3);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Itineraries",
      description: "Get personalized travel plans crafted by advanced AI"
    },
    {
      icon: Camera,
      title: "Smart Photo Journals",
      description: "Transform your photos into beautiful travel stories"
    },
    {
      icon: Map,
      title: "Real-Time Adaptation",
      description: "Adjust your plans instantly based on changing conditions"
    }
  ];

  return (
    <div className="overflow-hidden">
      {/* Enhanced Hero Section */}
      <div className="relative min-h-screen flex items-center">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-emerald-900 to-cyan-800"></div>
          <div className="absolute inset-0">
            <img
              className="h-full w-full object-cover mix-blend-overlay opacity-60"
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
              alt="Mountain landscape"
            />
          </div>
          {/* Floating geometric shapes */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute top-1/2 -left-10 w-20 h-20 bg-teal-400/10 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
            <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-emerald-400/10 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className={`max-w-4xl transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-8 leading-tight">
              Your Journey,{' '}
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl leading-relaxed mb-12">
              WanderGen is your intelligent travel companion. Create dynamic itineraries, 
              capture memories with smart photo journals, and adapt your plans in real-time.
            </p>
            
            {/* Interactive CTA Button */}
            <div className="flex justify-center">
              <Link 
                to="/planner" 
                className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl shadow-2xl hover:from-teal-500 hover:to-emerald-500 transform hover:scale-105 transition-all duration-200 border border-white/20 backdrop-blur-sm"
              >
                <Compass className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-200" />
                Start Planning Now
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent dark:from-teal-300 dark:to-emerald-300"> Perfect Travel</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              From planning to memories, WanderGen handles every aspect of your travel experience with intelligent automation.
            </p>
          </div>
          
          {/* Rotating Feature Showcase */}
          <div className="relative h-96 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-1000 transform ${
                    currentFeature === index
                      ? 'translate-y-0 opacity-100 scale-100'
                      : 'translate-y-10 opacity-0 scale-95'
                  }`}
                >
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 border border-gray-100 dark:border-gray-700 h-full flex items-center">
                    <div className="w-1/3 flex justify-center">
                      <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Icon className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <div className="w-2/3 pl-12">
                      <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Feature Indicators */}
          <div className="flex justify-center space-x-3">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentFeature(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentFeature === index
                    ? 'bg-teal-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          
          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">5 Min</h3>
              <p className="text-gray-600 dark:text-gray-300">Average planning time</p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">200+</h3>
              <p className="text-gray-600 dark:text-gray-300">Destinations covered</p>
            </div>
            
            <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transform hover:scale-105 transition-all duration-200">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Smart</h3>
              <p className="text-gray-600 dark:text-gray-300">AI-powered journals</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;