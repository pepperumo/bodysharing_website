import React, { useEffect, useRef } from 'react';
import { faUserPlus, faCalendarAlt, faShieldAlt, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../assets/images/_56e07e0e-4f57-4d1d-b6a8-39eee4dcb08b.jpg';
import '../../styles/Contact.css';
import ContactMethod from '../contact/ContactMethod';
import ContactForm from '../contact/ContactForm';

const Contact = (): React.ReactElement => {
  const contentSectionRef = useRef<HTMLElement | null>(null);
  
  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    if (contentSectionRef.current) {
      const elementTop = contentSectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementTop < windowHeight - 100) {
        contentSectionRef.current.classList.add('active');
      }
    }
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
          <h1 className="text-center">Contact Us</h1>
          <p className="text-center">Get in touch with the BodySharing community</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>      
        <div className="contact-methods">
          <ContactMethod icon={faUserPlus} title="Membership Inquiries">
            <p>For questions about joining our community or the application process:</p>
            <p><strong>Email:</strong> applications@bodysharing-berlin.de</p>
          </ContactMethod>
          
          <ContactMethod icon={faCalendarAlt} title="Event Information">
            <p>For questions about upcoming events (members only):</p>
            <p><strong>Email:</strong> events@bodysharing-berlin.de</p>
          </ContactMethod>
          
          <ContactMethod icon={faShieldAlt} title="Safety & Concerns">
            <p>For confidential discussions about safety or to report concerns:</p>
            <p><strong>Email:</strong> safety@bodysharing-berlin.de</p>
            <p>This inbox is monitored by our community safety team and all communications are strictly confidential.</p>
          </ContactMethod>
          
          <ContactMethod icon={faMapMarkerAlt} title="Location">
            <p>Our events take place at private venues throughout Berlin. Exact locations are shared only with approved members prior to events.</p>
          </ContactMethod>
        </div>
        
        <div className="application-section">
          <div className="application-content">
            <h2 className="text-center">Send a Message</h2>
            <p className="text-center">Complete the form below to contact us. Please be as specific as possible about your inquiry.</p>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
