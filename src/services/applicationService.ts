/**
 * Application Service for Event Application System
 * 
 * This service handles all API calls related to the event application system
 */

import { logger } from '../utils/logger';

// Firebase Cloud Function URLs
const SUBMIT_APPLICATION_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/submitEventApplication';
const GET_APPLICATION_STATUS_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/getApplicationStatus';

// Types
export type ApplicationSubmissionData = {
  name: string;
  email: string;
  consentAcknowledgment: boolean;
  dataRetentionAgreement: boolean;
  understandingConsent: string;
  attendeeType: 'single' | 'couple';
  partnerAlias?: string;
  photoUrl?: string;
};

export type ApplicationSubmissionResponse = {
  success: boolean;
  message: string;
  applicationId: string;
  trackingUrl: string;
};

export type ApplicationStatus = {
  id: string;
  status: 'pending' | 'reviewing' | 'rejected' | 'approved';
  name: string;
  email: string;
  attendeeType: string;
  submittedAt: string;
  updatedAt: string;
  rejectionReason?: string;
  eventDetails?: {
    date: string;
    time: string;
    location: string;
  };
  qrCodeUrl?: string;
};

/**
 * Submit an event application
 * @param formData The application form data
 * @param photo Optional photo file for upload
 * @returns Promise with the application submission response
 */
export const submitEventApplication = async (
  formData: ApplicationSubmissionData, 
  photo?: File
): Promise<ApplicationSubmissionResponse> => {
  logger.info('📝 Submitting event application form');
  
  try {
    // Handle photo upload if provided
    let photoUrl = formData.photoUrl || '';
    
    if (photo) {
      logger.info('📸 Processing photo for upload');
      
      try {
        // For demo purposes, we'll simulate a photo upload
        // In a real implementation, we would upload the photo to Firebase Storage
        // For now, we'll create a fake URL
        photoUrl = URL.createObjectURL(photo);
        
        logger.success('✅ Photo processed successfully');
      } catch (err) {
        logger.error('❌ Error processing photo:', err);
        throw new Error('Failed to process photo');
      }
    }
    
    // Create form data with photo URL
    const applicationData = {
      ...formData,
      photoUrl
    };
    
    logger.info('🚀 Sending application data to server');
    
    const response = await fetch(SUBMIT_APPLICATION_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Application submission failed:', errorData);
      throw new Error(errorData.error || 'Failed to submit application');
    }
    
    const data = await response.json();
    logger.success('✅ Application submitted successfully:', data);
    
    return data as ApplicationSubmissionResponse;
  } catch (error) {
    logger.error('❌ Error in submitEventApplication:', error);
    throw error;
  }
};

/**
 * Get the status of an application by ID
 * @param applicationId The application ID
 * @returns Promise with the application status
 */
export const getApplicationStatus = async (applicationId: string): Promise<ApplicationStatus> => {
  logger.info('🔍 Fetching application status for:', applicationId);
  
  try {
    const response = await fetch(`${GET_APPLICATION_STATUS_ENDPOINT}?id=${applicationId}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Failed to fetch application status:', errorData);
      throw new Error(errorData.error || 'Failed to fetch application status');
    }
    
    const data = await response.json();
    logger.success('✅ Application status fetched successfully:', data);
    
    return data as ApplicationStatus;
  } catch (error) {
    logger.error('❌ Error in getApplicationStatus:', error);
    throw error;
  }
};