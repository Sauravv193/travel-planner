import { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Sparkles, Camera, Map, Globe, ArrowRight, ChevronDown, IndianRupee, Star, Shield, Users, Clock, MapPin } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import ProductDemo from '../components/landing/ProductDemo';

const FloatingParticles = () => {
  const particles = useMemo(() =>
    Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
    })),
  []);
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div key={p.id} className="absolute rounded-full bg-maroon-400/10 dark:bg-maroon-500/5"
          style={{
            left: p.left, top: p.top,
            width: p.size + 'px', height: p.size + 'px',
            animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
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
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 15,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 15,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[calc(100vh-5rem)] flex items-center overflow-hidden bg-gradient-to-br from-cream-50 via-white to-beige-100 dark:from-night-bg dark:via-night-surface dark:to-[#1C1816]"
    >
      <FloatingParticles />

      {/* Decorative Orbs */}
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full opacity-[0.08] dark:opacity-[0.04] blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #6B2E2E, transparent)',
          transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-[0.05] dark:opacity-[0.03] blur-3xl pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #8A5A44, transparent)',
          transform: `translate(${mousePos.x * -0.3}px, ${mousePos.y * -0.3}px)`,
          transition: 'transform 0.5s ease-out',
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className={`space-y-6 sm:space-y-8 transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
          }`}>
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-maroon-50/80 dark:bg-maroon-500/10 backdrop-blur-sm border border-maroon-200/50 dark:border-maroon-500/20 rounded-full">
              <Sparkles className="w-4 h-4 text-maroon-500" />
              <span className="text-sm font-medium text-maroon-700 dark:text-maroon-300">
                AI-Powered Travel Planning for India
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-hero-mobile sm:text-hero text-warm-dark dark:text-white leading-tight">
              Plan Your
              <br />
              <span className="bg-gradient-to-r from-maroon-500 via-brown-500 to-maroon-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer">Perfect Trip</span>
              <br />
              Across India
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-brown-600 dark:text-night-muted max-w-xl leading-relaxed">
              Enter your destination, preferences, and budget. Watch as AI creates a personalized day-by-day itinerary with activities, restaurants, and recommendations across India.
            </p>

            {/* Feature Items */}
            <div className="space-y-3">
              {[
                { icon: Sparkles, text: 'Personalized itinerary generation' },
                { icon: Camera, text: 'Smart photo travel journals' },
                { icon: Globe, text: 'Real-time plan adaptation' },
                { icon: IndianRupee, text: 'Budget optimization in INR' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center space-x-3 opacity-0 animate-fade-in-up" style={{ animationDelay: `${(i + 1) * 150}ms`, animationFillMode: 'forwards' }}>
                  <div className="w-8 h-8 bg-gradient-to-br from-maroon-500 to-brown-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                    <feature.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-warm-dark dark:text-night-text font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/planner" className="btn-primary text-lg py-4 px-8 group">
                <Compass className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Start Planning
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              {!user ? (
                <>
                  <Link to="/signup" className="btn-secondary text-lg py-4 px-8">Get Started Free</Link>
                  <Link to="/signin" className="btn-ghost text-lg py-4 px-6">Sign In</Link>
                </>
              ) : (
                <Link to="/profile" className="btn-secondary text-lg py-4 px-8">My Dashboard</Link>
              )}
            </div>
          </div>

          {/* Right Column — Product Demo */}
          <div
            className={`transition-all duration-1000 delay-200 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
            }`}
            style={{
              perspective: '1000px',
              transform: `perspective(1000px) rotateY(${mousePos.x * 0.3}deg) rotateX(${mousePos.y * -0.3}deg)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            <ProductDemo />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-5 h-5 text-brown-500 dark:text-night-muted" />
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: Sparkles, title: 'Smart Itineraries', description: 'Get personalized travel plans crafted by AI for your preferences, budget, and travel style across India.', color: 'from-maroon-500 to-maroon-600' },
    { icon: Camera, title: 'Photo Journals', description: 'Transform your travel photos into beautiful, AI-generated narrative stories of your Indian adventures.', color: 'from-brown-500 to-brown-600' },
    { icon: Globe, title: 'Real-Time Adaptation', description: 'Weather changed? Plans shifted? Describe the situation and get instant adjustments to your itinerary.', color: 'from-beige-500 to-beige-600' },
    { icon: Map, title: 'Interactive Maps', description: 'View all your destinations, routes, and nearby recommendations on an interactive map.', color: 'from-maroon-500 to-brown-500' },
    { icon: Shield, title: 'Secure & Private', description: 'Your travel data is encrypted and secure. We never share your personal information with third parties.', color: 'from-maroon-600 to-maroon-700' },
    { icon: Users, title: 'Community Insights', description: 'Benefit from recommendations curated by fellow travelers who have explored the same destinations.', color: 'from-brown-400 to-brown-500' },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 overflow-hidden bg-white dark:bg-night-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-px bg-maroon-400"></div>
            <span className="text-sm font-medium uppercase tracking-widest text-maroon-600">Features</span>
            <div className="w-8 h-px bg-maroon-400"></div>
          </div>
          <h2 className="text-display text-warm-dark dark:text-white font-bold mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-maroon-500 via-brown-500 to-maroon-600 bg-clip-text text-transparent"> Perfect Travel</span>
          </h2>
          <p className="text-lg text-brown-600 dark:text-night-muted max-w-3xl mx-auto leading-relaxed">
            From planning to memories, WanderGen handles every aspect of your travel experience with intelligent automation.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index}
                className={`group card p-6 sm:p-8 transition-all duration-700 hover:-translate-y-1 ${
                  visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center shadow-lg mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-warm-dark dark:text-white mb-2">{feature.title}</h3>
                <p className="text-brown-600 dark:text-night-muted leading-relaxed text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const steps = [
    { step: 1, icon: MapPin, title: 'Choose Destination', description: 'Tell us where you want to go in India and your travel dates.' },
    { step: 2, icon: IndianRupee, title: 'Set Your Budget', description: 'Enter your total budget and preferences for the trip.' },
    { step: 3, icon: Sparkles, title: 'AI Generates Plan', description: 'Our AI creates a personalized day-by-day itinerary instantly.' },
    { step: 4, icon: Star, title: 'Enjoy & Adapt', description: 'Modify any part of the plan anytime — the AI adapts in real-time.' },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 bg-cream-50 dark:bg-night-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-px bg-maroon-400"></div>
            <span className="text-sm font-medium uppercase tracking-widest text-maroon-600">How It Works</span>
            <div className="w-8 h-px bg-maroon-400"></div>
          </div>
          <h2 className="text-display text-warm-dark dark:text-white font-bold mb-4">
            Plan a Trip in
            <span className="bg-gradient-to-r from-maroon-500 via-brown-500 to-maroon-600 bg-clip-text text-transparent"> 4 Simple Steps</span>
          </h2>
          <p className="text-lg text-brown-600 dark:text-night-muted max-w-2xl mx-auto leading-relaxed">
            From choosing your destination to getting a fully personalized itinerary — it&apos;s that easy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item) => (
            <div key={item.step}
              className={`relative text-center p-6 transition-all duration-700 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${item.step * 150}ms` }}
            >
              {/* Step connector line (desktop) */}
              {item.step < 4 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-maroon-300 to-transparent" />
              )}
              {/* Step number */}
              <div className="w-16 h-16 bg-gradient-to-br from-maroon-500 to-brown-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-maroon-500/20">
                <span className="text-2xl font-bold text-white">{item.step}</span>
              </div>
              <h3 className="text-lg font-bold text-warm-dark dark:text-white mb-2">{item.title}</h3>
              <p className="text-sm text-brown-600 dark:text-night-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const StatsBanner = () => (
  <section className="relative py-16 bg-gradient-to-r from-maroon-600 via-maroon-500 to-brown-600 overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.08),transparent_50%)]" />
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {[
          { value: '10K+', label: 'Trips Planned' },
          { value: '500+', label: 'Destinations' },
          { value: '50K+', label: 'Happy Travelers' },
          { value: '4.9/5', label: 'User Rating' },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="text-3xl sm:text-4xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-white/70 font-medium tracking-wide">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FAQSection = () => {
  const [visible, setVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    { q: 'How does the AI itinerary generation work?', a: 'WanderGen uses Google Gemini AI to analyze your destination, travel dates, budget, and interests. It then creates a personalized day-by-day itinerary with specific activities, restaurants, and recommendations tailored to your preferences across India.' },
    { q: 'Can I modify the AI-generated itinerary?', a: 'Absolutely! You can adapt your itinerary by describing changes (like "make it cheaper" or "add more outdoor activities"), and the AI will adjust your plan accordingly.' },
    { q: 'Is my travel data secure?', a: 'Yes. We use industry-standard security practices including JWT authentication, encrypted connections, and secure data storage. Your travel plans and personal information are never shared with third parties.' },
    { q: 'What makes the photo journal feature special?', a: 'Upload your travel photos and our AI analyzes them to create a beautiful, narrative travel journal. It organizes your memories into a coherent story with descriptions and context, making your photos come alive.' },
    { q: 'Can I plan trips for group travel?', a: 'Yes! WanderGen supports trips for up to 50 travelers. You can specify the number of travelers and preferred accommodation style for personalized group recommendations.' },
  ];

  return (
    <section ref={sectionRef} className="relative py-20 sm:py-28 bg-white dark:bg-night-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-px bg-maroon-400"></div>
            <span className="text-sm font-medium uppercase tracking-widest text-maroon-600">Support</span>
            <div className="w-8 h-px bg-maroon-400"></div>
          </div>
          <h2 className="text-display text-warm-dark dark:text-white font-bold mb-3">Frequently Asked Questions</h2>
          <p className="text-lg text-brown-600 dark:text-night-muted">Everything you need to know about WanderGen</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index}
              className={`card overflow-hidden transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              } ${openIndex === index ? 'border-maroon-300 dark:border-maroon-500/40' : ''}`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
                aria-expanded={openIndex === index}
              >
                <span className="text-base font-semibold text-warm-dark dark:text-white pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-brown-500 transition-transform duration-300 flex-shrink-0 ${
                  openIndex === index ? 'rotate-180 text-maroon-500' : ''
                }`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <p className="px-5 pb-5 text-brown-600 dark:text-night-muted leading-relaxed text-sm">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Home = () => (
  <div className="overflow-hidden">
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <StatsBanner />
    <FAQSection />
  </div>
);

export default Home;
