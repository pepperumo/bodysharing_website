import React, { useEffect, useRef } from 'react';
import backgroundImage from '../../assets/images/background.jpg';
import '../../styles/Consent.css';

const Consent = (): React.ReactElement => {
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
          <h1>Consent & Guidelines</h1>
          <p>The foundation of our community is built on explicit consent and clear communication</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>
        <div className="consent-card">
          <h2 className="text-center" style={{ margin: '0 auto', display: 'block', textAlign: 'center', width: '100%' }}>Our Consent Philosophy</h2>
          <p>At BodySharing, we believe that meaningful intimate experiences are built on a foundation of explicit, enthusiastic consent. Consent is an ongoing process—not a one-time agreement—and can be withdrawn at any time. Our community is built on these principles, creating a space where everyone feels safe, respected, and empowered.</p>
          <p>We define consent as a clear, enthusiastic "yes"—not the absence of a "no." This means being attentive to both verbal and non-verbal cues, regularly checking in with partners, and creating space for open communication about desires and boundaries.</p>
        </div>

        <div className="consent-banner">
          <h3>Our Core Principles</h3>
          <p>Every interaction within our community is guided by these foundational values</p>
        </div>

        <div className="principle-grid">
          <div className="principle-card">
            <div className="principle-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>Enthusiastic</h3>
            <p>Consent must be given freely and enthusiastically—never coerced or pressured.</p>
          </div>
          <div className="principle-card">
            <div className="principle-icon">
              <i className="fas fa-sync-alt"></i>
            </div>
            <h3>Ongoing</h3>
            <p>Consent is a continuous process that can be withdrawn at any time for any reason.</p>
          </div>
          <div className="principle-card">
            <div className="principle-icon">
              <i className="fas fa-comments"></i>
            </div>
            <h3>Explicit</h3>
            <p>Consent must be clearly expressed—it should never be assumed or implied.</p>
          </div>
          <div className="principle-card">
            <div className="principle-icon">
              <i className="fas fa-info-circle"></i>
            </div>
            <h3>Informed</h3>
            <p>All parties must have full information about what they're consenting to.</p>
          </div>
        </div>

        <div className="policy-section">
          <h2 className="section-title">House Rules</h2>
          <p className="section-intro">To ensure a safe, respectful environment for all members, we maintain these non-negotiable guidelines:</p>
          
          <div className="rules-grid">
            <div className="rule-card">
              <div className="rule-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Respect Boundaries</h3>
              <p>Always honor the boundaries set by others, without question or pressure.</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">
                <i className="fas fa-user-secret"></i>
              </div>
              <h3>Privacy</h3>
              <p>Maintain strict confidentiality about all members and activities within our community.</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">
                <i className="fas fa-hand-paper"></i>
              </div>
              <h3>No Harassment</h3>
              <p>Unwelcome advances or persistent attention after someone has declined is never acceptable.</p>
            </div>
            <div className="rule-card">
              <div className="rule-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Sober Consent</h3>
              <p>Consent must be given when all parties are in a clear state of mind—excessive substance use invalidates consent.</p>
            </div>
          </div>
        </div>

        <div className="policy-section age-verification">
          <h2 className="section-title">Age and Verification</h2>
          <div className="verification-content">
            <div className="verification-icon">
              <i className="fas fa-id-card"></i>
            </div>
            <div className="verification-details">
              <p>All BodySharing members must be 18+ and successfully complete our verification process to protect our community.</p>
              
              <h3>Verification Process:</h3>
              <ul className="verification-steps">
                <li><i className="fas fa-check"></i> Government-issued photo ID</li>
                <li><i className="fas fa-check"></i> Video verification call</li>
                <li><i className="fas fa-check"></i> Digital footprint review</li>
              </ul>
              
              <div className="alert-box">
                <i className="fas fa-exclamation-circle"></i>
                <p>Misrepresenting your age or identity will result in immediate permanent ban from BodySharing.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="policy-section violations">
          <h2 className="section-title">Violations & Consequences</h2>
          <p className="section-intro">We take consent violations very seriously. Consequences are determined based on the severity of the violation:</p>
          
          <div className="violations-grid">
            <div className="violation-level">
              <div className="level-indicator">
                <span className="level-1">Level 1</span>
              </div>
              <h3>Minor Boundary Cross</h3>
              <p>Unintentional misunderstandings that are immediately addressed when brought to attention.</p>
              <div className="consequences">
                <h4>Consequences:</h4>
                <ul>
                  <li>Verbal warning</li>
                  <li>Educational resources</li>
                </ul>
              </div>
            </div>
            
            <div className="violation-level">
              <div className="level-indicator">
                <span className="level-2">Level 2</span>
              </div>
              <h3>Consent Oversight</h3>
              <p>Failure to adequately check for consent or negligence in recognizing boundaries.</p>
              <div className="consequences">
                <h4>Consequences:</h4>
                <ul>
                  <li>Formal warning</li>
                  <li>Temporary suspension</li>
                  <li>Required consent training</li>
                </ul>
              </div>
            </div>
            
            <div className="violation-level">
              <div className="level-indicator">
                <span className="level-3">Level 3</span>
              </div>
              <h3>Deliberate Violation</h3>
              <p>Knowingly violating established boundaries or continuing after consent has been withdrawn.</p>
              <div className="consequences">
                <h4>Consequences:</h4>
                <ul>
                  <li>Extended suspension</li>
                  <li>Comprehensive review</li>
                  <li>Community service</li>
                </ul>
              </div>
            </div>
            
            <div className="violation-level">
              <div className="level-indicator">
                <span className="level-4">Level 4</span>
              </div>
              <h3>Severe Violation</h3>
              <p>Egregious consent violations or repeated pattern of disregard for consent principles.</p>
              <div className="consequences">
                <h4>Consequences:</h4>
                <ul>
                  <li>Permanent ban</li>
                  <li>Reporting to authorities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Consent;
