import React, { useEffect, useRef, useState } from 'react';
import backgroundImage from '../../assets/images/_56e07e0e-4f57-4d1d-b6a8-39eee4dcb08b.jpg';

interface FaqItem {
  question: string;
  answer: string;
}

const HowItWorks = (): React.ReactElement => {
  const processSectionRef = useRef<HTMLElement | null>(null);
  const faqSectionRef = useRef<HTMLElement | null>(null);
  
  // State for accordion functionality
  const [activeAccordion, setActiveAccordion] = useState<number | null>(null);
  
  // Function to toggle accordion items
  const toggleAccordion = (index: number) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };
  
  // Function to check if elements are in viewport to apply fade effect
  const checkFade = () => {
    const elements = [processSectionRef.current, faqSectionRef.current];
    
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
  
  // FAQ items for the accordion
  const faqItems: FaqItem[] = [
    {
      question: "What are BodySharing parties?",
      answer: "BodySharing events are intimate gatherings where like-minded adults can explore connections in a safe, consensual environment. Our events range from sensual social gatherings to more intimate experiences, always with a focus on mutual respect and clear boundaries."
    },
    {
      question: "Who can attend?",
      answer: "Membership is by invitation only. We carefully curate our community to ensure a balance of personalities, interests, and demographics. All attendees must be at least 21 years of age, respectful of boundaries, and committed to our consent guidelines."
    },
    {
      question: "How do I get invited?",
      answer: "You can request an invitation through our application process. This involves submitting an introduction about yourself, your views on consent, and whether you'll be attending solo or with partners. Our committee reviews all applications and makes decisions based on current community composition and your compatibility with our ethos."
    },
    {
      question: "What happens at the parties?",
      answer: "Each event has a different theme and focus, but all emphasize connection, communication, and consent. Typically, events begin with a social hour allowing guests to meet and establish comfort levels. As the evening progresses, different spaces are available for varying levels of intimacy. Consent ambassadors are always present to ensure guidelines are respected."
    },
    {
      question: "Is BodySharing only for certain relationship structures?",
      answer: "No, we welcome individuals of all relationship structures—solo, partnered, polyamorous, or other configurations—as long as all participants are clear about their boundaries and respect those of others."
    },
    {
      question: "How long does the application process take?",
      answer: "The application review typically takes 1-2 weeks. We carefully consider each application to ensure a balanced and harmonious community. You'll receive email updates on your application status."
    },
    {
      question: "Can I bring a friend who hasn't applied?",
      answer: "No, all attendees must complete the application process individually. Even if attending as a couple or group, each person needs their own approved application and personal QR code."
    },
    {
      question: "What is the acceptance rate for applications?",
      answer: "Our acceptance rate varies depending on current community composition and event capacity. We typically accept about 30-40% of applications, prioritizing those who demonstrate sincere alignment with our values and community culture."
    },
    {
      question: "If declined, can I apply again?",
      answer: "Yes, you may reapply after 3 months. We recommend using this time to reflect on your application and consider how to better express your alignment with our community values. Sometimes, applications are declined simply due to current community balance rather than any issue with the applicant."
    },
    {
      question: "How quickly will I receive a response?",
      answer: "We typically respond to all inquiries within 24-48 hours. For membership applications, the review process may take up to 7 days as we carefully evaluate all applications to ensure our community remains balanced and aligned with our values."
    },
    {
      question: "Can I visit an event before becoming a member?",
      answer: "Yes, we occasionally host introduction events specifically designed for potential new members. These events are more social in nature and provide an opportunity to meet current members and learn more about our community before deciding if it's right for you. Indicate your interest in attending an intro event when you contact us."
    },
    {
      question: "Is my contact information kept confidential?",
      answer: "Absolutely. We take privacy very seriously. Your contact information and any details you share with us are kept strictly confidential and will never be shared with third parties. Our community operates on mutual trust and respect for privacy."
    },
    {
      question: "Do you offer any educational workshops?",
      answer: "Yes, we regularly host workshops on topics such as consent practices, communication skills, boundary setting, and other subjects relevant to our community. These workshops are available to members and occasionally to the wider public. If you're interested in a specific workshop, please mention it in your message."
    },
    {
      question: "What if I need to report an incident?",
      answer: "We have a dedicated safety team that handles all reports with the utmost confidentiality and care. You can reach out to safety@bodysharing-berlin.de at any time to report concerns. All reports are taken seriously and addressed promptly to ensure our community remains safe for everyone."
    }
  ];
  
  return (
    <>
      <div className="page-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <h1 className="text-center">How It Works</h1>
          <p className="text-center">Our carefully curated application process ensures a safe, consensual community</p>
        </div>
      </div>
      
      <section className="process-section container fade-in" ref={processSectionRef}>
        
        <h2 className="section-title text-center" style={{ margin: '0 auto', display: 'block', textAlign: 'center', width: '100%' }}>The Journey to BodySharing</h2>
        <p className="section-subtitle text-center">Follow these 5 simple steps to join our community</p>
        
        <style>{`
          /* Process steps styling */
          
          .process-step {
            margin-bottom: 40px;
            position: relative;
          }
          
          .process-content h3 {
            font-size: 1.5rem;
            color: var(--accent-color);
            margin-bottom: 15px;
            font-weight: 600;
          }
          
          .process-timeline {
            padding: 20px 0;
          }
          
          .step-description {
            background-color: var(--light-bg);
            border-radius: 10px;
            padding: 25px;
            margin-top: 10px;
            border-left: 4px solid var(--accent-color);
          }
          
          .feature-list {
            list-style: none;
            padding-left: 10px;
            margin: 20px 0;
          }
          
          .feature-list li {
            margin-bottom: 12px;
            position: relative;
            padding-left: 25px;
            line-height: 1.5;
          }
          
          .feature-list li:before {
            content: "•";
            color: var(--accent-color);
            font-size: 1.5rem;
            position: absolute;
            left: 0;
            top: -5px;
          }
          
          .note-box {
            background-color: var(--light-bg);
            border-left: 4px solid var(--accent-color);
            padding: 15px 25px;
            margin: 20px 0;
            border-radius: 10px;
          }
          
          .note-box p {
            margin: 0;
          }
          
          .consent-quote {
            font-style: italic;
            color: var(--accent-color);
            padding: 15px 25px;
            border-left: 4px solid var(--accent-color);
            margin: 20px 0;
            background-color: var(--light-bg);
            border-radius: 10px;
          }
          
          /* FAQ Accordion Styling */
          .accordion {
            margin-top: 30px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          .accordion-item {
            border-bottom: 1px solid rgba(225, 190, 231, 0.3);
          }
          
          .accordion-header {
            padding: 18px 20px;
            background-color: rgba(156, 39, 176, 0.1);
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: background-color 0.3s;
          }
          
          .accordion-header:hover {
            background-color: rgba(156, 39, 176, 0.2);
          }
          
          .accordion-header h3 {
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
            color: #e1bee7;
          }
          
          .accordion-content {
            max-height: 0;
            overflow: hidden;
            background-color: rgba(30, 30, 30, 0.8);
            transition: max-height 0.5s ease;
          }
          
          .accordion-content.active {
            max-height: 1000px;
            padding: 20px;
          }
          
          .accordion-content p {
            color: #ffffff;
            margin: 0;
            line-height: 1.6;
          }
          
          .text-center {
            text-align: center;
          }
          
          .section-subtitle {
            font-size: 1.2rem;
            margin-bottom: 40px;
            color: var(--accent-color);
          }
        `}</style>
        
        <div className="process-timeline">
          <div className="process-step">
            <div className="process-content">
              <h3>1. Submit Your Introduction</h3>
              <div className="step-description">
                <p>The first step to joining our community is sending an introduction that includes:</p>
                <ul className="feature-list">
                  <li>A recent photo that clearly shows your face</li>
                  <li>A brief personal introduction (300-500 words)</li>
                  <li>Your personal interests and boundaries</li>
                  <li>Whether you're attending solo, as a couple, or in a group</li>
                </ul>
                <p>We value authenticity and genuine connections, so please be honest and thoughtful in your introduction.</p>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="process-content">
              <h3>2. Share Your View on Consent</h3>
              <div className="step-description">
                <p>Consent is the cornerstone of our community. We ask all applicants to share their personal understanding of consent and how they practice it in intimate settings.</p>
                <p>This helps us ensure that every member of our community shares our values of respect, communication, and mutual pleasure.</p>
                <div className="consent-quote">
                  <p>Consent isn't just about saying 'yes' or 'no'—it's about creating a space where everyone feels empowered to express their authentic desires and boundaries.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="process-content">
              <h3>3. Committee Review</h3>
              <div className="step-description">
                <p>Our diverse committee carefully reviews all applications to ensure:</p>
                <ul className="feature-list">
                  <li>A balanced community composition</li>
                  <li>Alignment with our values on consent and respect</li>
                  <li>Genuine interest in the community (not just the events)</li>
                  <li>Verification of identity and information</li>
                </ul>
                <p>This thorough review process may take 1-2 weeks, as we carefully consider each application.</p>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="process-content">
              <h3>4. Invitation and QR Code</h3>
              <div className="step-description">
                <p>If approved, you'll receive a personalized invitation to upcoming events. This includes:</p>
                <ul className="feature-list">
                  <li>A unique QR code for event check-in</li>
                  <li>Detailed information about the next event</li>
                  <li>Guidelines specific to the event theme</li>
                  <li>Contact information for event hosts</li>
                </ul>
                <p>Your QR code is personal and non-transferable—it's linked to your verified identity within our community.</p>
              </div>
            </div>
          </div>
          
          <div className="process-step">
            <div className="process-content">
              <h3>5. Welcome Meeting</h3>
              <div className="step-description">
                <p>Before attending your first full event, new members attend a welcome meeting where you will:</p>
                <ul className="feature-list">
                  <li>Meet the community organizers and consent ambassadors</li>
                  <li>Participate in consent workshops and exercises</li>
                  <li>Learn about event protocols and communication signals</li>
                  <li>Have all your questions answered in a safe, supportive environment</li>
                </ul>
                <p>This introduction ensures that everyone enters the community with the same understanding of our values and practices.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="faq-section container fade-in" ref={faqSectionRef}>
        <h2 className="text-center" id="faq" style={{ margin: '0 auto', display: 'block', textAlign: 'center', width: '100%' }}>Frequently Asked Questions</h2>
        
        <div className="accordion">
          {faqItems.map((item, index) => (
            <div className="accordion-item" key={index}>
              <div 
                className={`accordion-header ${activeAccordion === index ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <h3>{item.question}</h3>
                <span>{activeAccordion === index ? '-' : '+'}</span>
              </div>
              <div className={`accordion-content ${activeAccordion === index ? 'active' : ''}`}>
                <p>{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
