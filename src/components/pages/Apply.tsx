import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApplicationForm from '../application/ApplicationForm';
import { submitEventApplication, ApplicationSubmissionData } from '../../services/applicationService';
import { logger } from '../../utils/logger';
import backgroundImage from '../../assets/images/background.jpg';
import '../../styles/Apply.css';

const Apply: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [applicationId, setApplicationId] = useState<string>('');
  const [trackingUrl, setTrackingUrl] = useState<string>('');
  const contentSectionRef = useRef<HTMLElement | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (formData: ApplicationSubmissionData, photoFile?: File) => {
    setLoading(true);
    setError(null);
    try {
      logger.info('📝 Handling application form submission');
      const response = await submitEventApplication(formData, photoFile);
      logger.success('✅ Application submitted successfully');
      setSuccess(true);
      setApplicationId(response.applicationId);
      setTrackingUrl(response.trackingUrl);
      window.scrollTo(0, 0);
    } catch (err) {
      logger.error('❌ Error submitting application:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStatus = () => {
    navigate(`/eventapplication/${applicationId}`);
  };

  const checkFade = () => {
    if (contentSectionRef.current) {
      const elementTop = contentSectionRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      if (elementTop < windowHeight - 100) {
        contentSectionRef.current.classList.add('active');
      }
    }
  };

  useEffect(() => {
    checkFade();
    window.addEventListener('scroll', checkFade);
    return () => {
      window.removeEventListener('scroll', checkFade);
    };
  }, []);

  return (
    <>
      <div className="page-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <h1 className="text-center">Apply</h1>
          <p className="text-center">Join our community by completing the application process</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>
        <h2 className="text-center">Application Form</h2>
        <p className="text-center">Please fill out the form below to apply for membership.</p>
        {success ? (
          <div className="application-success">
            <div className="success-icon">✓</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for applying to our BodySharing event. Your application has been received and will be reviewed by our team.</p>
            <div className="tracking-info">
              <p>You can track the status of your application using the link below:</p>
              <div className="tracking-url">
                <input type="text" value={trackingUrl} readOnly />
                <button className="copy-button" onClick={() => {
                  navigator.clipboard.writeText(trackingUrl);
                  alert('Tracking URL copied to clipboard!');
                }}>Copy</button>
              </div>
              <p className="tracking-note"><strong>Note:</strong> Please save this link as it allows you to check your application status.</p>
            </div>
            <div className="success-actions">
              <button onClick={handleViewStatus} className="primary-button">View Application Status</button>
              <Link to="/" className="secondary-button">Return to Home</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="apply-intro">
              <p>Thank you for your interest in our BodySharing event. Before you apply, please make sure you have read and understood our <Link to="/consent" className="inline-link">consent guidelines</Link> and <Link to="/how-it-works" className="inline-link">how our events work</Link>.</p>
              <div className="application-notice">
                <h3>Application Process</h3>
                <ol>
                  <li>Complete the application form below</li>
                  <li>You'll receive a confirmation email with a tracking link</li>
                  <li>Our team will review your application</li>
                  <li>You'll be notified of the decision via email</li>
                  <li>If approved, you'll receive an entry QR code and event details</li>
                </ol>
              </div>
              {error && <div className="error-message"><p><strong>Error:</strong> {error}</p></div>}
            </div>
            <div className="application-form-container">
              <h2>Application Form</h2>
              <ApplicationForm onSubmit={handleSubmit} loading={loading} />
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default Apply;