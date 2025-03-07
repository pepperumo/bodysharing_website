import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEnvelopeOpenText, 
  faUserShield, 
  faChartBar, 
  faStar, 
  faShieldAlt,
  faUsers,
  faArrowsAlt,
  faHandshake
} from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../assets/images/_56e07e0e-4f57-4d1d-b6a8-39eee4dcb08b.jpg';
import '../../styles/AfterParty.css';

const AfterParty = (): React.ReactElement => {
  const contentSectionRef = useRef<HTMLElement | null>(null);
  const benefitsRef = useRef<HTMLElement | null>(null);

  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    const refs = [contentSectionRef, benefitsRef];
    
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
          <h1 className="text-center">After the Party</h1>
          <p className="text-center">How we maintain our community standards through feedback</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>
        <h2 className="text-center">Our Feedback and Rating System</h2>
        <p className="text-center">At BodySharing, the experience doesn't end when you leave the venue. Our commitment to creating a safe, respectful community continues through our private feedback and rating system. This helps us maintain high standards and ensure every member contributes positively to our shared experience.</p>
        
        <div className="process-card">
          <div className="process-icon-wrapper">
            <FontAwesomeIcon icon={faEnvelopeOpenText} />
          </div>
          <div className="process-content">
            <h3 className="text-center">Post-Event Reflection</h3>
            <p className="text-center">Within 24 hours after each event, attendees receive a private link to a secure feedback form. This includes:</p>
            <ul>
              <li>Overall event experience rating</li>
              <li>Feedback on venue, atmosphere, and activities</li>
              <li>Specific comments about what worked well and what could be improved</li>
              <li>Opportunity to confidentially report any consent concerns</li>
            </ul>
            <p className="text-center">Your honest feedback helps us continually refine our events to better serve the community.</p>
          </div>
        </div>
        
        <div className="process-card">
          <div className="process-icon-wrapper">
            <FontAwesomeIcon icon={faUserShield} />
          </div>
          <div className="process-content">
            <h3 className="text-center">Peer Feedback</h3>
            <p className="text-center">Members have the option to provide private, constructive feedback about interactions with others at the event. This system:</p>
            <ul>
              <li>Is completely confidential — feedback is never shared directly with recipients</li>
              <li>Requires specific, behavioral observations rather than judgments</li>
              <li>Focuses on both positive experiences and areas for growth</li>
              <li>Helps our community coordinators identify patterns that may require attention</li>
            </ul>
            <p className="text-center">This approach maintains privacy while ensuring accountability and continuous improvement within our community.</p>
          </div>
        </div>
        
        <div className="process-card">
          <div className="process-icon-wrapper">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className="process-content">
            <h3 className="text-center">Rating Categories</h3>
            <p className="text-center">Our feedback system includes ratings in several key areas that reflect our community values:</p>
            <ul>
              <li><strong>Consent Awareness:</strong> How well the person communicated and respected boundaries</li>
              <li><strong>Communication:</strong> Clarity, honesty, and effectiveness of verbal and non-verbal communication</li>
              <li><strong>Respectfulness:</strong> Level of consideration shown toward others and the shared space</li>
              <li><strong>Community Contribution:</strong> How the person's presence enhanced the overall experience</li>
            </ul>
            <p className="text-center">These ratings help maintain the quality of our community while offering individuals constructive insights about their impact.</p>
          </div>
        </div>
        
        <h3 className="text-center">Example Rating Categories</h3>
        
        <div className="rating-example">
          <h3 className="text-center">Communication</h3>
          <div className="rating-stars">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="rating-comment">
            "They were exceptionally clear about their boundaries and interests, checked in regularly during our interaction, and was receptive to my communication as well. A model of effective communication."
          </div>
        </div>
        
        <div className="rating-example">
          <h3 className="text-center">Consent Awareness</h3>
          <div className="rating-stars">
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
            <FontAwesomeIcon icon={faStar} />
          </div>
          <div className="rating-comment">
            "They demonstrated exceptional awareness of consent throughout our encounter, regularly checking in, responding immediately to subtle cues, and creating space for me to express my needs freely."
          </div>
        </div>
      </section>

      <section className="container fade-in" ref={benefitsRef}>
        <h2 className="text-center">Benefits of Our Feedback System</h2>
        <p className="text-center">Our carefully designed feedback system creates numerous benefits for our community:</p>
        
        <div className="benefits-grid">
          <div className="benefit-card">
            <div className="benefit-icon">
              <FontAwesomeIcon icon={faShieldAlt} />
            </div>
            <h3 className="text-center">Safety</h3>
            <p className="text-center">Our feedback system helps identify potential concerns early, allowing us to address them before they become problems. This creates a safer environment for everyone.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <FontAwesomeIcon icon={faUsers} />
            </div>
            <h3 className="text-center">Community Quality</h3>
            <p className="text-center">Consistently positive ratings are required to maintain membership, ensuring our community continues to be composed of respectful, considerate individuals.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <FontAwesomeIcon icon={faArrowsAlt} />
            </div>
            <h3 className="text-center">Personal Growth</h3>
            <p className="text-center">Aggregated, anonymous feedback provides members with valuable insights about how they're experienced by others, creating opportunities for self-awareness and growth.</p>
          </div>
          
          <div className="benefit-card">
            <div className="benefit-icon">
              <FontAwesomeIcon icon={faHandshake} />
            </div>
            <h3 className="text-center">Mutual Respect</h3>
            <p className="text-center">When everyone knows they're part of an accountable community, interactions tend to be more mindful, creating a culture of deep respect and consideration.</p>
          </div>
        </div>
        
        <div className="quote-box">
          <p className="quote-text">The feedback system at BodySharing has been invaluable for my personal growth. Receiving anonymous, thoughtful reflections about how others experience me has helped me become more aware of my impact and improved my ability to connect authentically.</p>
          <p className="quote-author">- Anonymous Member, 3 Years</p>
        </div>
        
        <p className="text-center">Through this thoughtful approach to community accountability, we maintain the high standards that make BodySharing events uniquely transformative, while creating space for everyone to learn and grow in their relational skills.</p>
      </section>
    </>
  );
};

export default AfterParty;
