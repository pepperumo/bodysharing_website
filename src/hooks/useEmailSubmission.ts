import { useState } from 'react';
import { sendContactFormEmail, ContactFormData } from '../services/emailService';

interface UseEmailSubmissionResult {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: Error | null;
  submitContactForm: (formData: ContactFormData) => Promise<void>;
  resetStatus: () => void;
}

/**
 * Custom hook for handling email form submission
 * @returns Object with submission state and functions
 */
const useEmailSubmission = (): UseEmailSubmissionResult => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Submit contact form data to be sent as email
   * @param formData The contact form data
   */
  const submitContactForm = async (formData: ContactFormData): Promise<void> => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await sendContactFormEmail(formData);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }
      
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Reset the submission status
   */
  const resetStatus = () => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
  };

  return {
    isSubmitting,
    isSuccess,
    error,
    submitContactForm,
    resetStatus
  };
};

export default useEmailSubmission;