/**
 * Email service using Firebase Cloud Functions to interact with Resend.com
 * 
 * This service handles sending emails through Firebase Cloud Functions
 */

import { logger } from '../utils/logger';

export interface ContactFormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  consent: boolean;
}

// Firebase Cloud Functions URLs - Update these with your actual deployed function URLs
const SEND_CONTACT_FORM_EMAIL_ENDPOINT = 'https://us-central1-bodysharing-4b51e.cloudfunctions.net/sendContactFormEmail';

/**
 * Formats and sends a contact form submission as an email through Firebase Cloud Functions
 * @param formData Form data from the contact form
 * @returns Promise with the send result
 */
const sendContactFormEmail = async (data: ContactFormData) => {
  logger.info('🚀 Starting contact form submission process');
  logger.debug('Form data:', data);

  try {
    logger.info('📤 Sending request to Cloud Function');
    const response = await fetch(SEND_CONTACT_FORM_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      credentials: 'omit',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      logger.error('❌ Server responded with an error:', errorData);
      throw new Error(errorData.message || 'Network response was not ok');
    }

    const responseData = await response.json();
    logger.success('✅ Contact form submitted successfully', responseData);
    return response;
  } catch (error) {
    logger.error('❌ Error sending contact form:', error);
    throw error;
  }
};

export { sendContactFormEmail };

export default sendContactFormEmail;