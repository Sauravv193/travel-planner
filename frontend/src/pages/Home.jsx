import { createElement, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, ArrowUpRight, Camera, Check, ChevronDown, Compass,
  MapPin, Sparkles, Wallet, WandSparkles, CalendarDays, Route
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const destinations = [
  { name: 'Jaipur', region: 'Rajasthan', note: 'Palaces, colour & culture', image: 'https://images.unsplash.com/photo-1599661046827-dacff0c0f09a?auto=format&fit=crop&w=900&q=85', days: '3–4 days' },
  { name: 'Varanasi', region: 'Uttar Pradesh', note: 'A city unlike anywhere else', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=85', days: '2–3 days' },
  { name: 'Kerala', region: 'South India', note: 'Slow days by the water', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=85', days: '5–7 days' },
  { name: 'Ladakh', region: 'Himalayas', note: 'Big skies & open roads', image: 'https://images.unsplash.com/photo-1566837497312-7be4a7a7b2a5?auto=format&fit=crop&w=900&q=85', days: '6–8 days' },
];

const features = [
  { icon: WandSparkles, title: 'A plan that feels like yours', text: 'Get a day-by-day itinerary shaped around your dates, budget, pace and interests.' },
  { icon: Route, title: 'Every day, easy to scan', text: 'See the highlights first. Open an activity only when you want the extra details.' },
  { icon: Wallet, title: 'Keep your budget in view', text: 'Understand estimated costs without digging through paragraphs of recommendations.' },
  { icon: Camera, title: 'Keep the moments', text: 'Bring your travel photos together in a journal made for the memories.' },
];

const faqs = [
  ['How does WanderGen create a trip?', 'Share your destination, dates, budget and interests. WanderGen uses AI to create a structured itinerary that you can review and adapt.'],
  ['Can I change my itinerary later?', 'Yes. Open a saved trip to review the plan and use the adaptation tools available on that trip.'],
  ['Are the costs exact?', 'No. AI-generated costs are estimates, not live quotes or guaranteed prices. Check transport, stays and attraction fees before booking.'],
  ['Can I save more than one trip?', 'Yes. Your trips are saved to your account so you can return to them later.'],
];

function Eyebrow({ children }) {
  return <span className="wg-eyebrow"><span className="wg-eyebrow-dot" />{children}</span>;
}

function Home() {
  const { user } = useAuth();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="wg-home">
      <section className="wg-home-hero">
        <div className="wg-home-hero-copy">
          <Eyebrow>YOUR NEXT CHAPTER STARTS HERE</Eyebrow>
          <h1>Less planning.<br /><em>More somewhere.</em></h1>
          <p className="wg-home-lede">Thoughtful trips across India, shaped around the way you want to travel. Tell us what matters. We’ll help with the details.</p>
          <div className="wg-home-actions">
            <Link to={user ? '/planner' : '/signup'} className="wg-home-primary">{user ? 'Plan a trip' : 'Start planning'} <ArrowUpRight size={18} /></Link>
            <a href="#how-it-works" className="wg-home-secondary">See how it works <ArrowRight size={16} /></a>
          </div>
          <div className="wg-home-proof">
            <span><Check size={15} /> Personalised itineraries</span>
            <span><Check size={15} /> Your budget, your pace</span>
            <span><Check size={15} /> Saved in one place</span>
          </div>
        </div>
        <div className="wg-home-visual">
          <div className="wg-hero-photo">
            <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=90" alt="Taj Mahal in Agra at warm sunset" />
            <div className="wg-hero-photo-shade" />
            <div className="wg-photo-caption"><span>THE ART OF GETTING AWAY</span><strong>India, at your own pace.</strong></div>
          </div>
          <div className="wg-floating-note wg-floating-note-top"><span className="wg-note-icon"><Sparkles size={16} /></span><span><strong>Made around you</strong><small>Not another generic itinerary</small></span></div>
          <div className="wg-floating-note wg-floating-note-bottom"><span className="wg-note-icon"><CalendarDays size={16} /></span><span><strong>Day-by-day clarity</strong><small>One good plan. No information overload.</small></span></div>
          <span className="wg-hero-orbit wg-hero-orbit-one" />
          <span className="wg-hero-orbit wg-hero-orbit-two" />
        </div>
        <div className="wg-hero-scroll"><span />SCROLL TO EXPLORE</div>
      </section>

      <section className="wg-home-intro">
        <div className="wg-home-intro-kicker"><Eyebrow>A BETTER WAY TO GET THERE</Eyebrow></div>
        <div><h2>Good trips don’t need<br /><em>a complicated plan.</em></h2><p>From the first idea to the last stop, WanderGen brings your travel essentials into one calm, considered space.</p></div>
      </section>

      <section className="wg-destinations-section">
        <div className="wg-section-top">
          <div><Eyebrow>FIND YOUR KIND OF ELSEWHERE</Eyebrow><h2>Where will you <em>wander?</em></h2></div>
          <Link to={user ? '/planner' : '/signup'} className="wg-text-link">Build your own trip <ArrowUpRight size={17} /></Link>
        </div>
        <div className="wg-destination-grid">
          {destinations.map((place, index) => (
            <Link to={user ? '/planner' : '/signup'} className={`wg-destination-card wg-destination-card-${index + 1}`} key={place.name}>
              <img src={place.image} alt={place.name} loading="lazy" />
              <span className="wg-destination-shade" />
              <span className="wg-destination-index">0{index + 1}</span>
              <span className="wg-destination-content"><small>{place.region} · {place.days}</small><strong>{place.name}</strong><span>{place.note}</span></span>
              <span className="wg-destination-arrow"><ArrowUpRight size={18} /></span>
            </Link>
          ))}
        </div>
        <p className="wg-image-note">A little inspiration to get you started. Your destination is entirely up to you.</p>
      </section>

      <section className="wg-feature-section">
        <div className="wg-feature-heading"><Eyebrow>THE WANDERGEN DIFFERENCE</Eyebrow><h2>Everything you need.<br /><em>Nothing you don’t.</em></h2><p>Useful detail, exactly when you need it. The rest stays out of your way.</p></div>
        <div className="wg-feature-grid">
          {features.map(({ icon, title, text }, index) => (
            <article className="wg-feature-card" key={title}>
              <span className="wg-feature-number">0{index + 1}</span>
              <span className="wg-feature-icon">{createElement(icon, { size: 21, strokeWidth: 1.7 })}</span>
              <h3>{title}</h3><p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="wg-how-section" id="how-it-works">
        <div className="wg-how-image">
          <img src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=85" alt="Colourful Indian city seen from above" loading="lazy" />
          <div className="wg-how-image-label"><MapPin size={15} /> MADE FOR INDIA, OPEN TO EVERYWHERE</div>
        </div>
        <div className="wg-how-copy">
          <Eyebrow>THREE SIMPLE STEPS</Eyebrow><h2>From “what if”<br />to <em>“let’s go.”</em></h2>
          <div className="wg-steps">
            <div><span>01</span><section><strong>Tell us the idea</strong><p>Choose a place, dates, budget and the things you love doing.</p></section></div>
            <div><span>02</span><section><strong>Make it yours</strong><p>Get a first itinerary, then adjust the pace and details to suit you.</p></section></div>
            <div><span>03</span><section><strong>Take it with you</strong><p>Save your trip and come back to the plan whenever you need it.</p></section></div>
          </div>
          <Link to={user ? '/planner' : '/signup'} className="wg-home-primary">Create your trip <ArrowUpRight size={18} /></Link>
        </div>
      </section>

      <section className="wg-quote-section">
        <div className="wg-quote-mark">“</div><p>The best part of a journey is having room for the unexpected.</p><span>MAKE A PLAN. LEAVE SPACE TO WANDER.</span>
      </section>

      <section className="wg-faq-section">
        <div className="wg-faq-intro"><Eyebrow>GOOD TO KNOW</Eyebrow><h2>A few things<br /><em>you might wonder.</em></h2><p>Clear answers before you set off.</p></div>
        <div className="wg-faq-list">
          {faqs.map(([question, answer], index) => (
            <div className={`wg-faq-item ${openFaq === index ? 'is-open' : ''}`} key={question}>
              <button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown size={19} /></button>
              <div className="wg-faq-answer"><p>{answer}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="wg-final-cta">
        <div className="wg-final-cta-orb" /><Eyebrow>YOUR NEXT ADVENTURE IS WAITING</Eyebrow>
        <h2>Make room for<br /><em>somewhere new.</em></h2>
        <p>Start with a destination. We’ll help you take it from there.</p>
        <Link to={user ? '/planner' : '/signup'} className="wg-final-cta-button">Let’s plan a trip <ArrowUpRight size={18} /></Link>
      </section>
    </div>
  );
}

export default Home;
