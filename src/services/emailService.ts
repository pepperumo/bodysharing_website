/**
 * Email service using Firebase Cloud Functions to interact with Resend.com
 * 
 * This service handles sending emails through Firebase Cloud Functions
 */

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
  try {
    const response = await fetch(SEND_CONTACT_FORM_EMAIL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': window.location.origin
      },
      mode: 'cors',
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Network response was not ok');
    }

    return response;
  } catch (error) {
    console.error('Error sending contact form email:', error);
    throw error;
  }
};

export { sendContactFormEmail };

export default sendContactFormEmail;