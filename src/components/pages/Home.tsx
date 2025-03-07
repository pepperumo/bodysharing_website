import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHandshake, faUserShield, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Home = (): React.ReactElement => {
  const introSectionRef = useRef<HTMLElement | null>(null);
  const eventSectionRef = useRef<HTMLElement | null>(null);
  
  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    const elements = [introSectionRef.current, eventSectionRef.current];
    
    elements.forEach((element: HTMLElement | null) => {
      if (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('active');
        }
      }
    });
  };
  
  // Set up fade effect on scroll
  useEffect(() => {
    // Initial check
    checkFade();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFade);
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', checkFade);
    };
  }, []);
  
  return (
    <>
      <div className="hero">
        <div 
          className="hero-overlay" 
          style={{ 
            backgroundImage: `url(${process.env.PUBLIC_URL}/images/_56e07e0e-4f57-4d1d-b6a8-39eee4dcb08b.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="hero-content">
          <h1 className="hero-title">Welcome to BodySharing</h1>
          <p className="hero-subtitle">Intimate gatherings celebrating consent in Berlin</p>
        </div>
      </div>
      
      <section className="intro container fade-in" ref={introSectionRef}>
        <h2>A Community Built on Trust</h2>
        <div className="intro-columns">
          <div className="intro-column">
            <i className="intro-icon">
              <FontAwesomeIcon icon={faHeart} />
            </i>
            <h3>Intimacy</h3>
            <p>BodySharing offers a safe space for exploring intimate connections with like-minded individuals who value consent and respect.</p>
          </div>
          <div className="intro-column">
            <i className="intro-icon">
              <FontAwesomeIcon icon={faHandshake} />
            </i>
            <h3>Consent</h3>
            <p>Our foundation is built on explicit consent. We maintain strict guidelines to ensure everyone feels comfortable and respected.</p>
          </div>
          <div className="intro-column">
            <i className="intro-icon">
              <FontAwesomeIcon icon={faUserShield} />
            </i>
            <h3>Privacy</h3>
            <p>Your privacy is our priority. All attendees agree to confidentiality, creating a secure environment for self-expression.</p>
          </div>
        </div>
      </section>
      
      <section className="event-info container fade-in" ref={eventSectionRef}>
        <h2>Our Events</h2>
        <div className="event-grid">
          <div className="event-card">
            <div className="event-image placeholder-img">
              <div className="event-theme">Masquerade</div>
            </div>
            <div className="event-details">
              <h3>Monthly Masquerade</h3>
              <p>Elegant anonymity meets passionate connections. Our signature event featuring masks and formal attire.</p>
              <p className="event-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Central Berlin
              </p>
            </div>
          </div>
          
          <div className="event-card">
            <div className="event-image placeholder-img">
              <div className="event-theme">Tactile</div>
            </div>
            <div className="event-details">
              <h3>Tactile Explorations</h3>
              <p>A journey of sensory exploration with an emphasis on touch and physical connection.</p>
              <p className="event-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Kreuzberg Area
              </p>
            </div>
          </div>
          
          <div className="event-card">
            <div className="event-image placeholder-img">
              <div className="event-theme">Immersion</div>
            </div>
            <div className="event-details">
              <h3>Full Immersion</h3>
              <p>Our most intimate gathering for experienced members, focusing on deeper connections.</p>
              <p className="event-location">
                <FontAwesomeIcon icon={faMapMarkerAlt} /> Private Villa, Outskirts of Berlin
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
