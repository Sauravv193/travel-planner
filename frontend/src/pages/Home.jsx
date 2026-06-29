import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Camera, Map, Globe, ArrowRight, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProductDemo from '../components/landing/ProductDemo';

const FloatingParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
    })),
  []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: p.size + 'px',
            height: p.size + 'px',
            animationDuration: p.duration + 's',
            animationDelay: p.delay + 's',
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const { user } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        setMousePos({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-50 via-white to-pink-50/30 dark:from-[#0A0A1A] dark:via-[#0E0E22] dark:to-[#12122A]"
    >
      <FloatingParticles />

      {/* Gradient Orbs */}
      <div
        className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-20 dark:opacity-10 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #FF6B8A, transparent)',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10 dark:opacity-5 blur-3xl"
        style={{
          background: 'radial-gradient(circle, #8B5CF6, transparent)',
          transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Hero Content */}
          <div className={`space-y-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-sm font-medium text-pink-700 dark:text-pink-300">
                AI-Powered Travel Planning
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-hero-mobile sm:text-hero text-gray-900 dark:text-white leading-tight">
              Plan Your
              <br />
              <span className="gradient-text-premium">Perfect Trip</span>
              <br />
              in Minutes
            </h1>

            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-night-muted max-w-xl leading-relaxed">
              Enter your destination, preferences, and budget. Watch as AI creates a personalized day-by-day itinerary with specific activities, restaurants, and recommendations.
            </p>

            {/* Feature List */}
            <div className="space-y-4 stagger-children">
              {[
                { icon: Sparkles, text: 'Personalized itinerary generation' },
                { icon: Camera, text: 'Smart photo travel journals' },
                { icon: Globe, text: 'Real-time plan adaptation' },
                { icon: Star, text: 'Budget optimization' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/planner"
                className="btn-primary text-lg py-4 px-8 group"
              >
                <Compass className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Start Planning
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              {!user ? (
                <>
                  <Link
                    to="/signup"
                    className="btn-secondary text-lg py-4 px-8"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/signin"
                    className="btn-ghost text-lg py-4 px-6"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link
                  to="/profile"
                  className="btn-secondary text-lg py-4 px-8"
                >
                  My Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Right Side - Interactive Product Demo */}
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{
              transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${mousePos.y * -0.3}deg)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <ProductDemo />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-gray-400 dark:text-night-muted" />
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: Sparkles,
      title: 'Smart Itineraries',
      description: 'Get personalized travel plans crafted by AI for your preferences, budget, and travel style.',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: Camera,
      title: 'Photo Journals',
      description: 'Transform your travel photos into beautiful, AI-generated narrative stories.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Globe,
      title: 'Real-Time Adaptation',
      description: 'Weather changed? Plans shifted? Describe the situation and get instant adjustments.',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'View all your destinations, routes, and nearby recommendations on an interactive map.',
      gradient: 'from-blue-500 to-indigo-600',
    },
  ];

  return (
    <div ref={sectionRef} className="relative py-24 sm:py-32 overflow-hidden bg-white dark:bg-[#0A0A1A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-display text-gray-900 dark:text-white font-bold mb-6">
            Everything You Need for
            <span className="gradient-text-premium"> Perfect Travel</span>
          </h2>
          <p className="text-xl text-gray-500 dark:text-night-muted max-w-3xl mx-auto leading-relaxed">
            From planning to memories, WanderGen handles every aspect of your travel experience with intelligent automation.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`card card-hover p-8 transition-all duration-700 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-night-muted leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: 'How does the AI itinerary generation work?',
      a: 'WanderGen uses Google\'s Gemini AI to analyze your destination, travel dates, budget, and interests. It then creates a personalized day-by-day itinerary with specific activities, restaurants, and recommendations tailored to your preferences.',
    },
    {
      q: 'Can I modify the AI-generated itinerary?',
      a: 'Absolutely! You can adapt your itinerary by describing changes (like "make it cheaper" or "add more outdoor activities"), and the AI will adjust your plan accordingly. You can also use our conversational AI chat to make specific modifications.',
    },
    {
      q: 'Is my travel data secure?',
      a: 'Yes. We use industry-standard security practices including JWT authentication, encrypted connections, and secure data storage. Your travel plans and personal information are never shared with third parties.',
    },
    {
      q: 'What makes the photo journal feature special?',
      a: 'Upload your travel photos and our AI analyzes them to create a beautiful, narrative travel journal. It organizes your memories into a coherent story with descriptions and context, making your photos come alive.',
    },
  ];

  return (
    <div ref={sectionRef} className="relative py-24 sm:py-32 bg-gray-50 dark:bg-[#0E0E22]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="text-display text-gray-900 dark:text-white font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-500 dark:text-night-muted">
            Everything you need to know about WanderGen
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`card overflow-hidden transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-600 dark:text-night-muted leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
};

export default Home;
