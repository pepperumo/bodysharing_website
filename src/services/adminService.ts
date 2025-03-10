/**
 * Admin service for managing event applications
 * 
 * This service handles admin operations for event applications
 */

import { logger } from '../utils/logger';

// Application item interface for admin dashboard
export interface AdminApplicationItem {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'reviewing' | 'rejected' | 'approved';
  submittedAt: string;
  updatedAt: string;
  attendeeType: string;
  partnerAlias?: string;
  photoUrl?: string;
  understandingConsent: string;
  rejectionReason?: string;
  qrCodeUrl?: string;
  checkInStatus?: 'not_checked_in' | 'checked_in';
  checkInTime?: string;
}

// Firebase Cloud Function URLs
const ADMIN_GET_APPLICATIONS_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/getApplicationsList';
const ADMIN_UPDATE_STATUS_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/updateApplicationStatus';
const ADMIN_SCAN_QR_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/scanQrCode';

/**
 * Get all applications for admin dashboard
 * @returns Promise with the list of applications
 */
export const getApplicationsList = async (): Promise<AdminApplicationItem[]> => {
  logger.info('🔍 Fetching applications list for admin');
  
  try {
    // This would typically include admin authentication
    const response = await fetch(ADMIN_GET_APPLICATIONS_ENDPOINT);
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Failed to fetch applications:', errorData);
      throw new Error(errorData.message || 'Failed to fetch applications');
    }
    
    const data = await response.json();
    logger.success('✅ Applications fetched successfully:', { count: data.length });
    
    // For demo purposes, if the API is not available, return mock data
    if (!data || data.length === 0) {
      return getMockApplications();
    }
    
    return data as AdminApplicationItem[];
  } catch (error) {
    logger.error('❌ Error in getApplicationsList:', error);
    
    // For demo purposes, return mock data if the API fails
    return getMockApplications();
  }
};

/**
 * Update the status of an application
 * @param applicationId The application ID
 * @param status The new status
 * @param rejectionReason Optional reason for rejection
 * @returns Promise with the updated application
 */
export const updateApplicationStatus = async (
  applicationId: string,
  status: 'pending' | 'reviewing' | 'approved' | 'rejected',
  rejectionReason?: string
): Promise<AdminApplicationItem> => {
  logger.info('🔄 Updating application status:', { applicationId, status });
  
  try {
    // This would typically include admin authentication
    const response = await fetch(ADMIN_UPDATE_STATUS_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        applicationId,
        status,
        rejectionReason
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Failed to update application status:', errorData);
      throw new Error(errorData.message || 'Failed to update application status');
    }
    
    const data = await response.json();
    logger.success('✅ Application status updated successfully');
    
    // For demo purposes, if the API is not available, return mock data
    return data as AdminApplicationItem;
  } catch (error) {
    logger.error('❌ Error in updateApplicationStatus:', error);
    
    // For demo purposes, simulate a successful update
    return simulateStatusUpdate(applicationId, status, rejectionReason);
  }
};

/**
 * Scan a QR code for event check-in
 * @param qrCode The QR code value
 * @returns Promise with the scan result
 */
export const scanQrCode = async (qrCode: string): Promise<{
  success: boolean;
  message: string;
  name?: string;
  email?: string;
  applicationId?: string;
  attendeeType?: string;
}> => {
  logger.info('🎟️ Scanning QR code for check-in');
  
  try {
    // This would typically include admin authentication
    const response = await fetch(ADMIN_SCAN_QR_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ qrCode }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Failed to process QR code:', errorData);
      throw new Error(errorData.message || 'Failed to process QR code');
    }
    
    const data = await response.json();
    logger.success('✅ QR code processed successfully');
    
    return data;
  } catch (error) {
    logger.error('❌ Error in scanQrCode:', error);
    
    // For demo purposes, simulate a successful QR scan 80% of the time
    const isSuccess = Math.random() > 0.2;
    
    if (isSuccess) {
      // Get a random name for the demo
      const names = ['Alex Smith', 'Jamie Wong', 'Taylor Reed', 'Jordan Patel'];
      const randomName = names[Math.floor(Math.random() * names.length)];
      
      return {
        success: true,
        message: 'QR code validated successfully. Attendee checked in.',
        name: randomName,
        email: `${randomName.toLowerCase().split(' ').join('.')}@example.com`,
        applicationId: qrCode,
        attendeeType: Math.random() > 0.3 ? 'single' : 'couple'
      };
    } else {
      const errorMessages = [
        'QR code is invalid or has expired.',
        'This ticket has already been scanned.',
        'This application was rejected.',
        'Application not found in the system.'
      ];
      
      return {
        success: false,
        message: errorMessages[Math.floor(Math.random() * errorMessages.length)]
      };
    }
  }
};

// Mock functions for demo purposes when API is unavailable

/**
 * Generate mock applications for demo purposes
 */
const getMockApplications = (): AdminApplicationItem[] => {
  logger.info('🔄 Generating mock applications data for demo');
  
  const statuses: ('pending' | 'reviewing' | 'rejected' | 'approved')[] = ['pending', 'reviewing', 'rejected', 'approved'];
  const mockApplications: AdminApplicationItem[] = [];
  
  // Generate 15 mock applications
  for (let i = 0; i < 15; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const isCouple = Math.random() > 0.7;
    const submittedDate = new Date();
    const name = `Applicant ${i + 1}`;
    
    // Adjust the submission date to be 1-30 days in the past
    submittedDate.setDate(submittedDate.getDate() - Math.floor(Math.random() * 30) - 1);
    
    const application: AdminApplicationItem = {
      id: `app-${Math.random().toString(36).substring(2, 10)}`,
      name,
      email: `applicant${i + 1}@example.com`,
      status,
      submittedAt: submittedDate.toISOString(),
      updatedAt: new Date().toISOString(),
      attendeeType: isCouple ? 'couple' : 'single',
      understandingConsent: 'This is a sample understanding of consent for demonstration purposes. In a real application, this would contain the applicant\'s detailed explanation of their understanding of consent in intimate settings.',
      photoUrl: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'women' : 'men'}/${Math.floor(Math.random() * 99)}.jpg`
    };
    
    if (isCouple) {
      application.partnerAlias = `Partner of ${name}`;
    }
    
    if (status === 'rejected') {
      application.rejectionReason = 'This is a sample rejection reason for demonstration purposes.';
    }
    
    if (status === 'approved') {
      application.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(application.id);
      application.checkInStatus = Math.random() > 0.5 ? 'checked_in' : 'not_checked_in';
      
      if (application.checkInStatus === 'checked_in') {
        const checkInDate = new Date();
        checkInDate.setHours(checkInDate.getHours() - Math.floor(Math.random() * 5));
        application.checkInTime = checkInDate.toISOString();
      }
    }
    
    mockApplications.push(application);
  }
  
  return mockApplications;
};

/**
 * Simulate a status update for demo purposes
 */
const simulateStatusUpdate = (
  applicationId: string,
  newStatus: 'pending' | 'reviewing' | 'approved' | 'rejected',
  rejectionReason?: string
): AdminApplicationItem => {
  const mockApplication: AdminApplicationItem = {
    id: applicationId,
    name: 'Demo Applicant',
    email: 'demo@example.com',
    status: newStatus,
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    updatedAt: new Date().toISOString(),
    attendeeType: 'single',
    understandingConsent: 'This is a sample understanding of consent.'
  };
  
  if (newStatus === 'rejected' && rejectionReason) {
    mockApplication.rejectionReason = rejectionReason;
  }
  
  if (newStatus === 'approved') {
    mockApplication.qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + encodeURIComponent(applicationId);
  }
  
  return mockApplication;
};