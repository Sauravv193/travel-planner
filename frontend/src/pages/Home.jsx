import { Link } from 'react-router-dom';
import { MapPin, Compass, Camera, Sparkles, Map, Clock, CheckCircle, LogIn, UserPlus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ProductDemo from '../components/landing/ProductDemo';

const Home = () => {
  const { user } = useAuth();
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
      title: "Smart Itineraries",
      description: "Get personalized travel plans crafted for your preferences"
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
      {/* Product-Focused Hero Section */}
      <div className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Value Proposition */}
            <div className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
                Plan Your Perfect Trip in{' '}
                <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
                  Minutes
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mb-8">
                Enter your destination, preferences, and budget. Watch as AI creates a personalized day-by-day itinerary with specific activities, restaurants, and recommendations.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  "Personalized itinerary generation",
                  "Real-time plan adaptation",
                  "Smart photo travel journals",
                  "Budget optimization"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/planner" 
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-pink-400 to-pink-600 rounded-xl shadow-lg hover:from-pink-300 hover:to-pink-500 transform hover:scale-105 transition-all duration-200"
                >
                  <Compass className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                  Start Planning
                </Link>
                {!user ? (
                  <>
                    <Link
                      to="/signup"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-pink-600 dark:text-pink-400 bg-white dark:bg-gray-800 border-2 border-pink-300 dark:border-pink-600 rounded-xl hover:bg-pink-50 dark:hover:bg-gray-700 transition-all duration-200"
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      Get Started Free
                    </Link>
                    <Link
                      to="/signin"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-200"
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/profile"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:border-pink-500 dark:hover:border-pink-400 transition-all duration-200"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    My Dashboard
                  </Link>
                )}
              </div>
            </div>
            
            {/* Right Side - Product Demo */}
            <div className={`transform transition-all duration-1000 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <ProductDemo />
            </div>
          </div>
        </div>
      </div>
      
      {/* Enhanced Features Section */}
      <div className="py-24 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Everything You Need for
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent dark:from-pink-300 dark:to-pink-500"> Perfect Travel</span>
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
                      <div className="w-32 h-32 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center shadow-2xl">
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
                    ? 'bg-pink-600 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
          

          {/* FAQ Section */}
          <div className="mt-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Common questions about WanderGen
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">How does the AI itinerary generation work?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  WanderGen uses Google's Gemini AI to analyze your destination, travel dates, budget, and interests. It then creates a personalized day-by-day itinerary with specific activities, restaurants, and recommendations tailored to your preferences.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Is my travel data secure?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Yes. We use industry-standard security practices including JWT authentication, encrypted connections, and secure data storage. Your travel plans and personal information are never shared with third parties.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Can I modify the AI-generated itinerary?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Absolutely. You can adapt your itinerary by describing changes (like "it's raining" or "add more outdoor activities"), and the AI will adjust your plan accordingly. You can also regenerate the entire itinerary if needed.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">What makes the photo journal feature special?</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  Upload your travel photos and our AI analyzes them to create a beautiful, narrative travel journal. It organizes your memories into a coherent story with descriptions and context, making your photos come alive.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;