import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationStatus, ApplicationStatus as AppStatus } from '../../services/applicationService';
import { logger } from '../../utils/logger';
import '../../styles/EventApplication.css';

const ApplicationStatus: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<AppStatus | null>(null);
  
  useEffect(() => {
    const fetchApplicationStatus = async () => {
      if (!applicationId) {
        setError('No application ID provided');
        setLoading(false);
        return;
      }
      
      try {
        logger.info('🔍 Fetching application status for ID:', applicationId);
        const statusData = await getApplicationStatus(applicationId);
        setApplication(statusData);
        logger.success('✅ Application status fetched successfully');
      } catch (err) {
        logger.error('❌ Error fetching application status:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch application status');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplicationStatus();
  }, [applicationId]);
  
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewing':
        return 'status-reviewing';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };
  
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleBackToHome = () => {
    navigate('/');
  };
  
  if (loading) {
    return (
      <div className="application-status-page">
        <div className="status-container loading-container">
          <div className="loading-spinner"></div>
          <p>Loading application status...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="application-status-page">
        <div className="status-container error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="primary-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  if (!application) {
    return (
      <div className="application-status-page">
        <div className="status-container error-container">
          <h2>Application Not Found</h2>
          <p>We couldn't find an application with the provided ID. Please check the URL and try again.</p>
          <button className="primary-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="application-status-page">
      <div className="status-container">
        <h1>Application Status</h1>
        
        <div className="status-header">
          <div className={`status-badge ${getStatusClass(application.status)}`}>
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </div>
          <div className="application-id">
            ID: {application.id}
          </div>
        </div>
        
        <div className="application-details">
          <div className="detail-section">
            <h3>Personal Information</h3>
            <div className="detail-row">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{application.name}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{application.email}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Attendee Type:</span>
              <span className="detail-value">
                {application.attendeeType === 'single' ? 'Individual' : 'Couple'}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Applied On:</span>
              <span className="detail-value">{formatDate(application.submittedAt)}</span>
            </div>
            {application.updatedAt !== application.submittedAt && (
              <div className="detail-row">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{formatDate(application.updatedAt)}</span>
              </div>
            )}
          </div>
          
          {application.status === 'rejected' && application.rejectionReason && (
            <div className="detail-section rejection-section">
              <h3>Feedback</h3>
              <p className="rejection-reason">{application.rejectionReason}</p>
              <div className="reapply-info">
                <p>You're welcome to reapply to future events.</p>
                <button 
                  className="secondary-button"
                  onClick={() => navigate('/apply')}
                >
                  Apply for Next Event
                </button>
              </div>
            </div>
          )}
          
          {application.status === 'approved' && application.eventDetails && (
            <div className="detail-section event-details-section">
              <h3>Event Details</h3>
              <div className="detail-row">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{application.eventDetails.date}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Time:</span>
                <span className="detail-value">{application.eventDetails.time}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Location:</span>
                <span className="detail-value">{application.eventDetails.location}</span>
              </div>
              
              {application.qrCodeUrl && (
                <div className="qr-code-section">
                  <h4>Entry QR Code</h4>
                  <p>Present this QR code at check-in for entry to the event.</p>
                  <div className="qr-code-container">
                    <img 
                      src={application.qrCodeUrl} 
                      alt="Entry QR Code" 
                      className="qr-code-image" 
                    />
                  </div>
                  <div className="qr-code-instructions">
                    <p>Save this QR code to your phone or print it out before arriving.</p>
                    <button 
                      className="primary-button"
                      onClick={() => window.print()}
                    >
                      Print QR Code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {(application.status === 'pending' || application.status === 'reviewing') && (
            <div className="detail-section status-info-section">
              <h3>
                {application.status === 'pending' ? 'Application Pending' : 'Under Review'}
              </h3>
              <p>
                {application.status === 'pending' 
                  ? 'Your application has been received and is awaiting review by our team.' 
                  : 'Your application is currently being reviewed by our team.'}
              </p>
              <p>You'll receive an email notification when your application status changes.</p>
              
              <div className="status-timeline">
                <div className={`timeline-step ${['pending', 'reviewing', 'approved'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="step-indicator"></div>
                  <div className="step-label">Submitted</div>
                </div>
                <div className="timeline-connector"></div>
                <div className={`timeline-step ${['reviewing', 'approved'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="step-indicator"></div>
                  <div className="step-label">Under Review</div>
                </div>
                <div className="timeline-connector"></div>
                <div className={`timeline-step ${['approved'].includes(application.status) ? 'completed' : ''}`}>
                  <div className="step-indicator"></div>
                  <div className="step-label">Decision</div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="status-actions">
          <button className="secondary-button" onClick={handleBackToHome}>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;