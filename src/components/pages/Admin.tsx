import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, 
  faTimesCircle, 
  faEye, 
  faSearch, 
  faHourglassHalf,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import { 
  getApplicationsList, 
  updateApplicationStatus, 
  AdminApplicationItem
} from '../../services/adminService';
import { logger } from '../../utils/logger';
import '../../styles/Admin.css';

const Admin = (): React.ReactElement => {
  const [applications, setApplications] = useState<AdminApplicationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'reviewing' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewApplication, setViewApplication] = useState<AdminApplicationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Fetch applications on component mount
  useEffect(() => {
    fetchApplications();
  }, []);

  // Fetch applications from API
  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      logger.info('🔍 Fetching applications list');
      const data = await getApplicationsList();
      setApplications(data);
    } catch (err) {
      logger.error('❌ Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter applications based on current filter and search query
  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = searchQuery === '' || 
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Handle application approval
  const handleApprove = async (application: AdminApplicationItem) => {
    setProcessingId(application.id);
    
    try {
      logger.info('✅ Approving application:', { id: application.id });
      await updateApplicationStatus(application.id, 'approved');
      
      // Refresh the applications list
      fetchApplications();
    } catch (err) {
      logger.error('❌ Error approving application:', err);
      setError('Failed to approve application. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle application rejection
  const handleReject = async (application: AdminApplicationItem) => {
    if (!rejectionReason.trim()) {
      setError('Please provide a reason for rejection');
      return;
    }
    
    setProcessingId(application.id);
    
    try {
      logger.info('❌ Rejecting application:', { id: application.id, reason: rejectionReason });
      await updateApplicationStatus(application.id, 'rejected', rejectionReason);
      
      // Reset form and refresh the applications list
      setRejectionReason('');
      setViewApplication(null);
      fetchApplications();
    } catch (err) {
      logger.error('❌ Error rejecting application:', err);
      setError('Failed to reject application. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Handle setting application to "under review" status
  const handleReview = async (application: AdminApplicationItem) => {
    setProcessingId(application.id);
    
    try {
      logger.info('👀 Setting application to review:', { id: application.id });
      await updateApplicationStatus(application.id, 'reviewing');
      
      // Refresh the applications list
      fetchApplications();
    } catch (err) {
      logger.error('❌ Error updating application status:', err);
      setError('Failed to update application status. Please try again.');
    } finally {
      setProcessingId(null);
    }
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending"><FontAwesomeIcon icon={faHourglassHalf} /> Pending</span>;
      case 'reviewing':
        return <span className="status-badge reviewing"><FontAwesomeIcon icon={faEye} /> Under Review</span>;
      case 'approved':
        return <span className="status-badge approved"><FontAwesomeIcon icon={faCheckCircle} /> Approved</span>;
      case 'rejected':
        return <span className="status-badge rejected"><FontAwesomeIcon icon={faTimesCircle} /> Rejected</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  // Render the application detail modal
  const renderApplicationModal = () => {
    if (!viewApplication) return null;
    
    return (
      <div className="modal-backdrop">
        <div className="modal">
          <div className="modal-header">
            <h2>Application Details</h2>
            <button className="close-button" onClick={() => setViewApplication(null)}>&times;</button>
          </div>
          
          <div className="modal-body">
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className="detail-value">{renderStatusBadge(viewApplication.status)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Submitted:</span>
              <span className="detail-value">{formatDate(viewApplication.submittedAt)}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Name/Alias:</span>
              <span className="detail-value">{viewApplication.name}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{viewApplication.email}</span>
            </div>
            
            <div className="detail-row">
              <span className="detail-label">Attendee Type:</span>
              <span className="detail-value">{viewApplication.attendeeType === 'single' ? 'Single Attendee' : 'Couple'}</span>
            </div>
            
            {viewApplication.attendeeType === 'couple' && viewApplication.partnerAlias && (
              <div className="detail-row">
                <span className="detail-label">Partner Alias:</span>
                <span className="detail-value">{viewApplication.partnerAlias}</span>
              </div>
            )}
            
            {viewApplication.photoUrl && (
              <div className="detail-row photo-row">
                <span className="detail-label">Photo:</span>
                <div className="detail-value">
                  <img src={viewApplication.photoUrl} alt="Applicant" className="applicant-photo" />
                </div>
              </div>
            )}
            
            <div className="detail-section">
              <h3>Understanding of Consent</h3>
              <p className="consent-text">{viewApplication.understandingConsent}</p>
            </div>
            
            {viewApplication.rejectionReason && (
              <div className="detail-section rejection-section">
                <h3>Rejection Reason</h3>
                <p>{viewApplication.rejectionReason}</p>
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            {viewApplication.status === 'pending' && (
              <>
                <button 
                  className="action-button review" 
                  onClick={() => handleReview(viewApplication)}
                  disabled={!!processingId}
                >
                  {processingId === viewApplication.id ? 'Processing...' : 'Mark as Reviewing'}
                </button>
                <button 
                  className="action-button approve" 
                  onClick={() => handleApprove(viewApplication)}
                  disabled={!!processingId}
                >
                  {processingId === viewApplication.id ? 'Processing...' : 'Approve Application'}
                </button>
              </>
            )}
            
            {viewApplication.status === 'reviewing' && (
              <>
                <button 
                  className="action-button approve" 
                  onClick={() => handleApprove(viewApplication)}
                  disabled={!!processingId}
                >
                  {processingId === viewApplication.id ? 'Processing...' : 'Approve Application'}
                </button>
              </>
            )}
            
            {(viewApplication.status === 'pending' || viewApplication.status === 'reviewing') && (
              <>
                <div className="rejection-form">
                  <textarea
                    placeholder="Provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="rejection-reason-input"
                    disabled={!!processingId}
                  ></textarea>
                  <button 
                    className="action-button reject" 
                    onClick={() => handleReject(viewApplication)}
                    disabled={!rejectionReason.trim() || !!processingId}
                  >
                    {processingId === viewApplication.id ? 'Processing...' : 'Reject Application'}
                  </button>
                </div>
              </>
            )}
            
            {viewApplication.status === 'approved' && viewApplication.qrCodeUrl && (
              <div className="qr-code-section">
                <h3>Entry QR Code</h3>
                <div className="qr-code-container">
                  <img src={viewApplication.qrCodeUrl} alt="Entry QR Code" className="qr-code" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page">
      <div className="admin-header" style={{ marginTop: '4rem' }}>
        <h1>Admin Dashboard</h1>
        <Link to="/admin/scanner" className="scanner-link">
          <FontAwesomeIcon icon={faQrcode} /> QR Code Scanner
        </Link>
      </div>

      <div className="admin-toolbar">
        <div className="filter-toolbar">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`} 
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'pending' ? 'active' : ''}`} 
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`filter-button ${filter === 'reviewing' ? 'active' : ''}`} 
            onClick={() => setFilter('reviewing')}
          >
            Under Review
          </button>
          <button 
            className={`filter-button ${filter === 'approved' ? 'active' : ''}`} 
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`filter-button ${filter === 'rejected' ? 'active' : ''}`} 
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
        
        <div className="search-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, email, or ID" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
        
        <button 
          className="refresh-button"
          onClick={fetchApplications}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="applications-list">
        {loading ? (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="no-applications">
            <p>No applications found matching your criteria.</p>
          </div>
        ) : (
          <table className="applications-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Name</th>
                <th>Email</th>
                <th>Type</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map(application => (
                <tr key={application.id}>
                  <td>{renderStatusBadge(application.status)}</td>
                  <td>{application.name}</td>
                  <td>{application.email}</td>
                  <td>{application.attendeeType === 'single' ? 'Single' : 'Couple'}</td>
                  <td>{formatDate(application.submittedAt)}</td>
                  <td>
                    <button 
                      className="view-button"
                      onClick={() => setViewApplication(application)}
                    >
                      <FontAwesomeIcon icon={faEye} /> View
                    </button>
                    
                    {application.status === 'pending' && (
                      <button 
                        className="review-button small"
                        onClick={() => handleReview(application)}
                        disabled={!!processingId}
                      >
                        Review
                      </button>
                    )}
                    
                    {(application.status === 'pending' || application.status === 'reviewing') && (
                      <button 
                        className="approve-button small"
                        onClick={() => {
                          setViewApplication(application);
                        }}
                        disabled={!!processingId}
                      >
                        Approve/Reject
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      {viewApplication && renderApplicationModal()}
    </div>
  );
};

export default Admin;