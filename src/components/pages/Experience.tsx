import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from '../../assets/images/background.jpg';
import '../../styles/Experience.css';

const Experience = (): React.ReactElement => {
  const contentSectionRef = useRef<HTMLElement | null>(null);
  const spacesRef = useRef<HTMLElement | null>(null);
  const bringRef = useRef<HTMLElement | null>(null);

  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    const refs = [contentSectionRef, spacesRef, bringRef];
    
    refs.forEach(ref => {
      if (ref.current) {
        const elementTop = ref.current.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          ref.current.classList.add('active');
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
      <div className="page-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <h1 className="text-center">The Experience</h1>
          <p className="text-center">What to expect at our intimate gatherings</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>
        <h2 className="text-center">Your Journey Through a BodySharing Event</h2>
        <p className="text-center">Each BodySharing event is carefully crafted to create a safe, enjoyable environment for connection and exploration. While every event has its unique theme and atmosphere, here's a general timeline of what you can expect:</p>
        
        <div className="experience-timeline">
          <div className="timeline-item timeline-left">
            <div className="timeline-content">
              <div className="timeline-time">19:30 - 20:30</div>
              <h3>Arrival & Welcome</h3>
              <p>Check in with your personal QR code and receive your welcome package, which includes:</p>
              <ul>
                <li>Color-coded wristband indicating your boundaries and interests</li>
                <li>Event guide with theme explanation and space overview</li>
                <li>Introduction to consent ambassadors who are available throughout the event</li>
              </ul>
              <p>Take time to settle in, enjoy a welcome drink, and become familiar with the space.</p>
            </div>
          </div>
          
          <div className="timeline-item timeline-right">
            <div className="timeline-content">
              <div className="timeline-time">20:30 - 21:30</div>
              <h3>Social Hour & Connection Activities</h3>
              <p>Begin to meet fellow attendees through structured activities designed to break the ice:</p>
              <ul>
                <li>Guided conversation exercises focused on boundaries and desires</li>
                <li>Interactive games that encourage getting to know each other</li>
                <li>Opportunities to discuss interests indicated by your wristband color</li>
              </ul>
              <p>This period helps establish comfort and connection before the evening progresses.</p>
            </div>
          </div>
          
          <div className="timeline-item timeline-left">
            <div className="timeline-content">
              <div className="timeline-time">21:30 - 22:00</div>
              <h3>Theme Introduction & Consent Review</h3>
              <p>Hosts bring everyone together to:</p>
              <ul>
                <li>Explain the evening's specific theme and related activities</li>
                <li>Review key consent principles and house rules</li>
                <li>Answer questions and clarify expectations</li>
                <li>Introduce the various spaces and their purposes</li>
              </ul>
              <p>This creates shared understanding and sets the tone for the night.</p>
            </div>
          </div>
          
          <div className="timeline-item timeline-right">
            <div className="timeline-content">
              <div className="timeline-time">22:00 - 01:00</div>
              <h3>Main Experience</h3>
              <p>The heart of the evening unfolds as various spaces open for exploration:</p>
              <ul>
                <li>Each room offers different experiences aligned with the theme</li>
                <li>Consent ambassadors remain present to ensure guidelines are followed</li>
                <li>You're free to engage or observe at your comfort level</li>
                <li>Quiet spaces are always available for conversation or relaxation</li>
              </ul>
              <p>This period allows for organic connections and experiences in a structured, safe environment.</p>
            </div>
          </div>
          
          <div className="timeline-item timeline-left">
            <div className="timeline-content">
              <div className="timeline-time">01:00 - 02:00</div>
              <h3>Wind Down & Reflection</h3>
              <p>As the evening comes to a close:</p>
              <ul>
                <li>Relaxation areas expand for gentle conversation</li>
                <li>Light refreshments are served</li>
                <li>Optional guided reflection exercises are offered</li>
                <li>Opportunity to connect with new acquaintances for future events</li>
              </ul>
              <p>This transition helps bring closure to the experience in a meaningful way.</p>
            </div>
          </div>
          
          <div className="timeline-item timeline-right">
            <div className="timeline-content">
              <div className="timeline-time">02:00</div>
              <h3>Farewell</h3>
              <p>As you depart:</p>
              <ul>
                <li>Receive information about upcoming events</li>
                <li>Optional anonymous feedback forms are available</li>
                <li>Hosts ensure everyone has safe transportation home</li>
              </ul>
              <p>We ensure every aspect of your experience, including departure, is handled with care.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="spaces-section container fade-in" ref={spacesRef}>
        <h2 className="text-center">Our Curated Spaces</h2>
        <p className="text-center">Each BodySharing event features carefully designed spaces to accommodate different comfort levels and desires. Here are the typical areas you'll find:</p>
        
        <div className="spaces-grid">
          <div className="space-card">
            <div className="space-image">Social Lounge</div>
            <div className="space-content">
              <h3>Social Lounge</h3>
              <p>The heart of conversation and connection, featuring comfortable seating, ambient music, and refreshments. This space is perfect for making initial connections and engaging in meaningful dialogue.</p>
              <div className="tags">
                <span className="tag">Conversation</span>
                <span className="tag">Relaxed</span>
                <span className="tag">Refreshments</span>
                <span className="tag">Fully Clothed</span>
              </div>
            </div>
            <div className="space-footer">
              <i className="fas fa-volume-down"></i> Soft conversation permitted
            </div>
          </div>
          
          <div className="space-card">
            <div className="space-image">Connection Room</div>
            <div className="space-content">
              <h3>Connection Room</h3>
              <p>A space for deeper sensory exploration through guided exercises and activities. This room features softer lighting, comfortable cushions, and changing themes that encourage physical connection while maintaining boundaries.</p>
              <div className="tags">
                <span className="tag">Sensory</span>
                <span className="tag">Touch</span>
                <span className="tag">Semi-private</span>
                <span className="tag">Light Contact</span>
              </div>
            </div>
            <div className="space-footer">
              <i className="fas fa-volume-off"></i> Whispers only
            </div>
          </div>
          
          <div className="space-card">
            <div className="space-image">Intimacy Suite</div>
            <div className="space-content">
              <h3>Intimacy Suite</h3>
              <p>For those seeking deeper intimate connections, this area offers privacy while maintaining community safety protocols. Consent ambassadors ensure guidelines are followed, and the space is designed for comfort and discretion.</p>
              <div className="tags">
                <span className="tag">Private</span>
                <span className="tag">Intimate</span>
                <span className="tag">Monitored</span>
                <span className="tag">Deep Connection</span>
              </div>
            </div>
            <div className="space-footer">
              <i className="fas fa-volume-mute"></i> Silence appreciated
            </div>
          </div>
          
          <div className="space-card">
            <div className="space-image">Reflection Garden</div>
            <div className="space-content">
              <h3>Reflection Garden</h3>
              <p>A quiet space for personal reflection or gentle conversation during and after exploration. The ambient sounds, soft lighting, and comfortable seating create a sanctuary for processing emotions and experiences.</p>
              <div className="tags">
                <span className="tag">Peaceful</span>
                <span className="tag">Reflection</span>
                <span className="tag">Rest</span>
                <span className="tag">Emotional Support</span>
              </div>
            </div>
            <div className="space-footer">
              <i className="fas fa-volume-off"></i> Whispers only
            </div>
          </div>
        </div>
      </section>

      <section className="container fade-in" ref={bringRef}>
        <h2 className="text-center">What to Bring</h2>
        <div className="bring-container">
          <div className="bring-category">
            <h3>1. Documentation</h3>
            <ul>
              <li>Valid photo ID (mandatory for entry)</li>
              <li>Your personalized QR code (sent via email)</li>
              <li>Completed pre-event questionnaire</li>
            </ul>
          </div>
          
          <div className="bring-category">
            <h3>2. Comfort Items</h3>
            <ul>
              <li>Comfortable clothing that allows for movement</li>
              <li>A change of clothes (optional)</li>
              <li>Slippers or soft-soled indoor shoes</li>
              <li>Personal items that make you feel at ease</li>
            </ul>
          </div>
          
          <div className="bring-category">
            <h3>3. Personal Care</h3>
            <ul>
              <li>Water bottle (refill stations available)</li>
              <li>Any necessary medications</li>
              <li>Small towel or handkerchief</li>
              <li>Breath mints or similar</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};

export default Experience;
