import React, { useState } from 'react';
import FormField from '../common/form/FormField';
import TextArea from '../common/form/TextArea';
import SelectField from '../common/form/SelectField';
import CheckboxField from '../common/form/CheckboxField';
import Button from '../common/form/Button';
import '../../styles/Contact.css';
import useEmailSubmission from '../../hooks/useEmailSubmission';

interface FormData {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  consent: boolean;
  toEmail: string; // Required field to specify recipient email
}

const ContactForm = (): React.ReactElement => {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    inquiryType: '',
    message: '',
    consent: false,
    toEmail: '' // Initialize with empty string
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  
  // Email submission hook - removing isSuccess as it's not being used
  const { isSubmitting, error, submitContactForm } = useEmailSubmission();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
    
    // Clear error when user checks the box
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    if (!formData.consent) {
      newErrors.consent = 'You must consent to our privacy policy';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set the toEmail based on inquiryType before validation
    setFormData(prevData => ({
      ...prevData,
      toEmail: getEmailForInquiryType(prevData.inquiryType)
    }));
    
    // Use updated formData with toEmail for validation
    if (validateForm()) {
      try {
        await submitContactForm({
          ...formData,
          toEmail: getEmailForInquiryType(formData.inquiryType)
        });
        setSubmitted(true);
      } catch (err) {
        console.error('Error submitting form:', err);
      }
    }
  };

  // Helper function to get the appropriate email address for each inquiry type
  const getEmailForInquiryType = (inquiryType: string): string => {
    switch (inquiryType) {
      case 'membership':
        return 'applications@bodysharing-berlin.de';
      case 'event':
        return 'events@bodysharing-berlin.de';
      case 'safety':
        return 'safety@bodysharing-berlin.de';
      case 'other':
      default:
        return 'info@bodysharing-berlin.de';
    }
  };

  const inquiryOptions = [
    { value: 'membership', label: 'Membership Application' },
    { value: 'event', label: 'Event Information' },
    { value: 'safety', label: 'Safety or Concern' },
    { value: 'other', label: 'Other Inquiry' }
  ];

  return (
    <div className="form-container">
      {submitted ? (
        <div className="form-success">
          <p>Thank you for your submission! We have sent you a confirmation email and will get back to you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <FormField 
            label="Name or Alias"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
          />
          
          <FormField 
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />
          
          <SelectField 
            label="Nature of Inquiry"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            options={inquiryOptions}
            error={errors.inquiryType}
          />
          
          <TextArea 
            label="Your Message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            error={errors.message}
            placeholder="Please be as detailed as possible about your inquiry. If you're applying for membership, tell us why you're interested in joining our community."
            rows={6}
          />
          
          <CheckboxField 
            label={
              <>
                I understand that by submitting this form, I am consenting to have my data securely stored 
                and processed for the purpose of responding to my inquiry. No data will be shared with third parties.
              </>
            }
            name="consent"
            checked={formData.consent}
            onChange={handleCheckboxChange}
            error={errors.consent}
          />
          
          {error && (
            <div className="form-error">
              <p>There was a problem sending your message: {error.message}</p>
            </div>
          )}
          
          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Submit'}
          </Button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;
