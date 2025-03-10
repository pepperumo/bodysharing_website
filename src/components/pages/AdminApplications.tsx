import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationsList, updateApplicationStatus } from '../../services/adminService';
import { useAppContext } from '../../context/AppContext';
import '../../styles/Admin.css';
import { logger } from '../../utils/logger';

interface Application {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  submittedAt: string;
  rejectionReason?: string;
  // Optional fields that may not be present in list view
  phone?: string;
  experience?: string;
  motivation?: string;
  expectations?: string;
}

const AdminApplications: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const { user } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!user || !user.isAdmin) {
      logger.error('🚫 Unauthorized access to admin applications page');
      navigate('/');
      return;
    }

    const loadApplications = async () => {
      try {
        logger.info('🔄 Loading event applications');
        setLoading(true);
        const appList = await getApplicationsList();
        setApplications(appList);
        logger.success(`✅ Loaded ${appList.length} applications`);
      } catch (err) {
        logger.error('❌ Failed to load applications', err);
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [user, navigate]);

  const handleStatusUpdate = async (appId: string, newStatus: 'pending' | 'reviewing' | 'approved' | 'rejected') => {
    try {
      logger.info(`🔄 Updating application ${appId} status to ${newStatus}`);
      setLoading(true);
      
      let updateData: any = { status: newStatus };
      
      // Add rejection reason if applicable
      if (newStatus === 'rejected' && rejectionReason.trim()) {
        updateData.rejectionReason = rejectionReason;
      }
      
      await updateApplicationStatus(appId, updateData);
      
      // Update local state
      setApplications(prevApps => 
        prevApps.map(app => 
          app.id === appId 
            ? { ...app, status: newStatus, ...(newStatus === 'rejected' ? { rejectionReason } : {}) } 
            : app
        )
      );
      
      // Reset selected app and reason
      setSelectedApp(null);
      setRejectionReason('');
      
      logger.success(`✅ Application ${appId} updated to ${newStatus}`);
    } catch (err) {
      logger.error(`❌ Failed to update application ${appId}`, err);
      setError('Failed to update application status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const viewApplicationDetail = (app: Application) => {
    setSelectedApp(app);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'reviewing': return 'status-reviewing';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  if (loading && !applications.length) {
    return (
      <div className="admin-container loading-state">
        <div className="loading-spinner"></div>
        <p>Loading applications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container error-state">
        <h2>Error</h2>
        <p>{error}</p>
        <button className="primary-button" onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1>Event Applications</h1>
      
      {applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications have been submitted yet.</p>
        </div>
      ) : (
        <div className="admin-content">
          <div className="applications-list">
            <h2>All Applications ({applications.length})</h2>
            <div className="filter-controls">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Pending</button>
              <button className="filter-btn">Reviewing</button>
              <button className="filter-btn">Approved</button>
              <button className="filter-btn">Rejected</button>
            </div>
            
            <table className="application-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id} className={app.status}>
                    <td>{app.name}</td>
                    <td>{app.email}</td>
                    <td>{formatDate(app.submittedAt)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="view-btn" 
                        onClick={() => viewApplicationDetail(app)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedApp && (
            <div className="application-detail">
              <div className="detail-header">
                <h2>Application Details</h2>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedApp(null)}
                >
                  &times;
                </button>
              </div>
              
              <div className="detail-content">
                <div className="detail-section">
                  <h3>Applicant Information</h3>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{selectedApp.name}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email:</span>
                    <span className="value">{selectedApp.email}</span>
                  </div>
                  {selectedApp.phone && (
                    <div className="detail-row">
                      <span className="label">Phone:</span>
                      <span className="value">{selectedApp.phone}</span>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="label">Submitted:</span>
                    <span className="value">{formatDate(selectedApp.submittedAt)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Status:</span>
                    <span className={`value status-badge ${getStatusClass(selectedApp.status)}`}>
                      {selectedApp.status}
                    </span>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Application Responses</h3>
                  {selectedApp.experience && (
                    <div className="response-item">
                      <h4>Experience</h4>
                      <p>{selectedApp.experience}</p>
                    </div>
                  )}
                  {selectedApp.motivation && (
                    <div className="response-item">
                      <h4>Motivation</h4>
                      <p>{selectedApp.motivation}</p>
                    </div>
                  )}
                  {selectedApp.expectations && (
                    <div className="response-item">
                      <h4>Expectations</h4>
                      <p>{selectedApp.expectations}</p>
                    </div>
                  )}
                </div>

                {selectedApp.status === 'rejected' && selectedApp.rejectionReason && (
                  <div className="detail-section rejection-section">
                    <h3>Rejection Reason</h3>
                    <p>{selectedApp.rejectionReason}</p>
                  </div>
                )}

                <div className="actions-section">
                  <h3>Update Status</h3>
                  
                  {selectedApp.status !== 'rejected' && (
                    <div className="action-group">
                      <button 
                        className="action-btn reject-btn"
                        onClick={() => {
                          if (!rejectionReason) {
                            alert('Please provide a rejection reason');
                            return;
                          }
                          handleStatusUpdate(selectedApp.id, 'rejected');
                        }}
                      >
                        Reject
                      </button>
                      <div className="reject-reason">
                        <label htmlFor="rejectionReason">Rejection reason:</label>
                        <textarea
                          id="rejectionReason"
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Provide a reason for rejection"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                  
                  {selectedApp.status === 'pending' && (
                    <button 
                      className="action-btn review-btn"
                      onClick={() => handleStatusUpdate(selectedApp.id, 'reviewing')}
                    >
                      Mark as Reviewing
                    </button>
                  )}
                  
                  {(selectedApp.status === 'pending' || selectedApp.status === 'reviewing') && (
                    <button 
                      className="action-btn approve-btn"
                      onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
                    >
                      Approve
                    </button>
                  )}
                  
                  {selectedApp.status === 'rejected' && (
                    <button 
                      className="action-btn review-btn"
                      onClick={() => handleStatusUpdate(selectedApp.id, 'reviewing')}
                    >
                      Reconsider
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;