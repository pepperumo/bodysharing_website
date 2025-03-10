import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faHourglassHalf, 
  faTimesCircle, 
  faQrcode,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../assets/images/background.jpg';
import { getApplicationStatus, ApplicationStatus } from '../../services/applicationService';
import { logger } from '../../utils/logger';
import '../../styles/EventApplication.css';

const EventApplication = (): React.ReactElement => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [application, setApplication] = useState<ApplicationStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  // Set up fade effect on scroll and fetch application data
  useEffect(() => {
    // Initial check for fade effect
    checkFade();
    
    // Add scroll event listener
    window.addEventListener('scroll', checkFade);
    
    // Fetch application status
    const fetchApplicationStatus = async () => {
      if (!applicationId) {
        setError('Application ID is missing');
        setLoading(false);
        return;
      }
      
      try {
        logger.info('🔍 Fetching application status', { applicationId });
        const data = await getApplicationStatus(applicationId);
        setApplication(data);
      } catch (err) {
        logger.error('❌ Error fetching application status:', err);
        setError('Unable to fetch application status. The application ID may be invalid.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationStatus();
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', checkFade);
    };
  }, [applicationId]);

  // Helper to format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Component for the step indicator
  const StepIndicator: React.FC<{ 
    status: 'pending' | 'reviewing' | 'rejected' | 'approved',
    currentStatus: string
  }> = ({ status, currentStatus }) => {
    const isActive = currentStatus === status;
    const isPassed = 
      (status === 'pending' && ['reviewing', 'rejected', 'approved'].includes(currentStatus)) ||
      (status === 'reviewing' && ['rejected', 'approved'].includes(currentStatus));
    
    const getIcon = () => {
      if (isActive) {
        switch (status) {
          case 'pending': return <FontAwesomeIcon icon={faHourglassHalf} className="status-icon pending" />;
          case 'reviewing': return <FontAwesomeIcon icon={faSpinner} className="status-icon reviewing spin" />;
          case 'rejected': return <FontAwesomeIcon icon={faTimesCircle} className="status-icon rejected" />;
          case 'approved': return <FontAwesomeIcon icon={faCheckCircle} className="status-icon approved" />;
        }
      } else if (isPassed) {
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon passed" />;
      } else {
        return <div className="status-dot"></div>;
      }
    };
    
    const getLabel = () => {
      switch (status) {
        case 'pending': return 'Application Submitted';
        case 'reviewing': return 'Under Review';
        case 'rejected': return 'Application Rejected';
        case 'approved': return 'Application Approved';
      }
    };
    
    const getStatusClass = () => {
      if (isActive) return status;
      if (isPassed) return 'passed';
      return '';
    };
    
    return (
      <div className={`step-indicator ${getStatusClass()}`}>
        <div className="indicator-icon">
          {getIcon()}
        </div>
        <p className="indicator-label">{getLabel()}</p>
      </div>
    );
  };

  // Render application status details
  const renderContent = () => {
    if (loading) {
      return (
        <div className="loading-status">
          <FontAwesomeIcon icon={faSpinner} className="spin" size="3x" />
          <p>Loading application status...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="error-status">
          <h3>Error Loading Application</h3>
          <p>{error}</p>
        </div>
      );
    }
    
    if (!application) {
      return (
        <div className="error-status">
          <h3>Application Not Found</h3>
          <p>We couldn't find an application with the provided ID. Please check the link and try again.</p>
        </div>
      );
    }
    
    return (
      <>
        <div className="status-summary">
          <h3>Application Status: <span className={`status-text ${application.status}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span></h3>
          <p>Submitted on {formatDate(application.submittedAt)}</p>
          {application.updatedAt !== application.submittedAt && (
            <p>Last updated on {formatDate(application.updatedAt)}</p>
          )}
        </div>
        
        <div className="status-tracker">
          <StepIndicator status="pending" currentStatus={application.status} />
          <div className="step-connector"></div>
          <StepIndicator status="reviewing" currentStatus={application.status} />
          <div className="step-connector"></div>
          {application.status === 'rejected' ? (
            <StepIndicator status="rejected" currentStatus={application.status} />
          ) : (
            <StepIndicator status="approved" currentStatus={application.status} />
          )}
        </div>
        
        {application.status === 'rejected' && application.rejectionReason && (
          <div className="rejection-reason">
            <h3>Reason for Rejection</h3>
            <p>{application.rejectionReason}</p>
            <div className="reapply-note">
              <p>You may apply again after 3 months with a new application.</p>
            </div>
          </div>
        )}
        
        {application.status === 'approved' && application.eventDetails && (
          <div className="approval-details">
            <h3>Event Details</h3>
            <div className="event-info">
              <p><strong>Date:</strong> {application.eventDetails.date}</p>
              <p><strong>Time:</strong> {application.eventDetails.time}</p>
              <p><strong>Location:</strong> {application.eventDetails.location}</p>
            </div>
            
            {application.qrCodeUrl && (
              <div className="qr-code-section">
                <h3>Your Entry QR Code</h3>
                <p>Present this code at the event entrance for quick check-in:</p>
                <div className="qr-code-container">
                  <img src={application.qrCodeUrl} alt="Entry QR Code" className="qr-code" />
                </div>
                <p className="qr-note">
                  This QR code is unique to you and non-transferrable. Screenshot this page or save the QR code to have it ready for the event.
                </p>
              </div>
            )}
          </div>
        )}
        
        <div className="application-summary">
          <h3>Application Summary</h3>
          <div className="summary-details">
            <div className="summary-row">
              <span className="label">Name/Alias:</span>
              <span className="value">{application.name}</span>
            </div>
            <div className="summary-row">
              <span className="label">Email:</span>
              <span className="value">{application.email}</span>
            </div>
            <div className="summary-row">
              <span className="label">Attendee Type:</span>
              <span className="value">{application.attendeeType === 'single' ? 'Single Attendee' : 'Couple'}</span>
            </div>
          </div>
        </div>
        
        <div className="bookmark-reminder">
          <h3>Important</h3>
          <p>
            Bookmark this page to check your application status at any time.
            We will also send updates to the email address you provided.
          </p>
        </div>
      </>
    );
  };

  return (
    <>
      <div className="page-header" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className="page-header-overlay"></div>
        <div className="page-header-content">
          <h1 className="text-center">Application Status</h1>
          <p className="text-center">Track the progress of your BodySharing event application</p>
        </div>
      </div>

      <section className="container fade-in" ref={contentSectionRef}>
        <div className="application-tracking-container">
          {renderContent()}
        </div>
      </section>
    </>
  );
};

export default EventApplication;