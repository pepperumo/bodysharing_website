import React, { useState, useRef } from 'react';
import { ApplicationSubmissionData } from '../../services/applicationService';
import { logger } from '../../utils/logger';

interface ApplicationFormProps {
  onSubmit: (formData: ApplicationSubmissionData, photoFile?: File) => void;
  loading: boolean;
}

const ApplicationForm: React.FC<ApplicationFormProps> = ({ onSubmit, loading }) => {
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [understandingConsent, setUnderstandingConsent] = useState('');
  const [consentAcknowledgment, setConsentAcknowledgment] = useState(false);
  const [dataRetentionAgreement, setDataRetentionAgreement] = useState(false);
  const [attendeeType, setAttendeeType] = useState<'single' | 'couple'>('single');
  const [partnerAlias, setPartnerAlias] = useState('');
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  // File references
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Handle photo file selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors({
          ...errors,
          photo: 'Please select an image file (JPG, PNG, etc.)'
        });
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          photo: 'Image is too large. Please select an image under 5MB.'
        });
        return;
      }
      
      // Clear any previous errors
      const updatedErrors = { ...errors };
      delete updatedErrors.photo;
      setErrors(updatedErrors);
      
      // Create preview URL and store file
      const previewUrl = URL.createObjectURL(file);
      setPhotoPreview(previewUrl);
      setPhotoFile(file);
      
      logger.info('📸 Photo selected:', file.name);
    }
  };
  
  // Remove photo
  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    
    if (photoInputRef.current) {
      photoInputRef.current.value = '';
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Validate consent understanding
    if (!understandingConsent.trim()) {
      newErrors.understandingConsent = 'Please explain your understanding of consent';
    } else if (understandingConsent.trim().length < 50) {
      newErrors.understandingConsent = 'Please provide a more detailed explanation (at least 50 characters)';
    }
    
    // Validate consent acknowledgment
    if (!consentAcknowledgment) {
      newErrors.consentAcknowledgment = 'You must acknowledge the consent policy';
    }
    
    // Validate data retention agreement
    if (!dataRetentionAgreement) {
      newErrors.dataRetentionAgreement = 'You must agree to the data retention policy';
    }
    
    // Validate partner alias if attendee type is couple
    if (attendeeType === 'couple' && !partnerAlias.trim()) {
      newErrors.partnerAlias = 'Partner name/alias is required for couples';
    }
    
    // Validate photo
    if (!photoPreview) {
      newErrors.photo = 'Please upload a photo for verification';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      logger.info('📝 Submitting application form');
      
      const formData: ApplicationSubmissionData = {
        name,
        email,
        understandingConsent,
        consentAcknowledgment,
        dataRetentionAgreement,
        attendeeType,
        ...(attendeeType === 'couple' ? { partnerAlias } : {})
      };
      
      onSubmit(formData, photoFile || undefined);
    } else {
      logger.error('❌ Form validation failed');
      
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      const firstErrorElement = document.getElementById(firstErrorKey);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  return (
    <form className="application-form" onSubmit={handleSubmit}>
      {/* Personal Information Section */}
      <div className="form-section">
        <h3>Personal Information</h3>
        
        <div className="form-group">
          <label htmlFor="name">Full Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            disabled={loading}
          />
          {errors.name && <div className="error-text">{errors.name}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            disabled={loading}
          />
          {errors.email && <div className="error-text">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label>Attendee Type *</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="attendeeType"
                checked={attendeeType === 'single'}
                onChange={() => setAttendeeType('single')}
                disabled={loading}
              />
              Individual
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="attendeeType"
                checked={attendeeType === 'couple'}
                onChange={() => setAttendeeType('couple')}
                disabled={loading}
              />
              Couple
            </label>
          </div>
        </div>
        
        {attendeeType === 'couple' && (
          <div className="form-group">
            <label htmlFor="partnerAlias">Partner Name/Alias *</label>
            <input
              id="partnerAlias"
              type="text"
              value={partnerAlias}
              onChange={(e) => setPartnerAlias(e.target.value)}
              placeholder="Enter your partner's name or alias"
              disabled={loading}
            />
            {errors.partnerAlias && <div className="error-text">{errors.partnerAlias}</div>}
            <div className="helper-text">
              Your partner must be present with you during the event.
            </div>
          </div>
        )}
      </div>
      
      {/* Photo Upload Section */}
      <div className="form-section">
        <h3>Photo Verification</h3>
        <div className="form-group">
          <label htmlFor="photo">Upload a Recent Photo *</label>
          <div className="photo-upload-container">
            {photoPreview ? (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-photo-btn"
                  onClick={handleRemovePhoto}
                  disabled={loading}
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="photo-upload-box">
                <input
                  ref={photoInputRef}
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={loading}
                  style={{ display: 'none' }}
                />
                <label htmlFor="photo" className="upload-btn">
                  Choose File
                </label>
                <span>No file chosen</span>
              </div>
            )}
          </div>
          {errors.photo && <div className="error-text">{errors.photo}</div>}
          <div className="helper-text">
            Please upload a clear, recent photo of yourself for verification purposes.
            {attendeeType === 'couple' && ' If applying as a couple, please include both individuals in the photo.'}
          </div>
        </div>
      </div>
      
      {/* Consent Understanding Section */}
      <div className="form-section">
        <h3>Consent Understanding</h3>
        <div className="form-group">
          <label htmlFor="understandingConsent">
            Please explain your understanding of consent in intimate settings *
          </label>
          <textarea
            id="understandingConsent"
            rows={6}
            value={understandingConsent}
            onChange={(e) => setUnderstandingConsent(e.target.value)}
            placeholder="In your own words, please explain what consent means to you and how it applies to intimate settings..."
            disabled={loading}
          />
          {errors.understandingConsent && (
            <div className="error-text">{errors.understandingConsent}</div>
          )}
        </div>
      </div>
      
      {/* Agreement Section */}
      <div className="form-section">
        <h3>Agreements</h3>
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={consentAcknowledgment}
              onChange={(e) => setConsentAcknowledgment(e.target.checked)}
              disabled={loading}
            />
            <span>
              I have read and understood the <a href="/consent" target="_blank">consent policy</a> and agree to respect all boundaries established during the event. *
            </span>
          </label>
          {errors.consentAcknowledgment && (
            <div className="error-text">{errors.consentAcknowledgment}</div>
          )}
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={dataRetentionAgreement}
              onChange={(e) => setDataRetentionAgreement(e.target.checked)}
              disabled={loading}
            />
            <span>
              I agree that my application information will be retained for verification purposes, and acknowledge that my data will be handled in accordance with the privacy policy. *
            </span>
          </label>
          {errors.dataRetentionAgreement && (
            <div className="error-text">{errors.dataRetentionAgreement}</div>
          )}
        </div>
      </div>
      
      {/* Submit Section */}
      <div className="form-submit">
        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Submitting Application...' : 'Submit Application'}
        </button>
        <p className="required-fields-note">* Required fields</p>
      </div>
    </form>
  );
};

export default ApplicationForm;