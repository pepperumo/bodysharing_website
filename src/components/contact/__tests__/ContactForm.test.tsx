import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

describe('ContactForm Component', () => {
  test('renders all form fields', () => {
    render(<ContactForm />);
    
    // Check if all form fields are present
    expect(screen.getByLabelText(/name or alias/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    
    // Check if submit button is present
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });
  
  test('validates form inputs', async () => {
    render(<ContactForm />);
    const user = userEvent.setup();
    
    // Get form elements
    const nameInput = screen.getByLabelText(/name or alias/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const messageInput = screen.getByLabelText(/your message/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    
    // Try to submit the form without filling anything
    await user.click(submitButton);
    
    // Check if at least one validation error appears
    await waitFor(() => {
      const errors = screen.getAllByText(/required|please|must/i);
      expect(errors.length).toBeGreaterThan(0);
    });
    
    // Fill the form with valid data
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message');
    
    // Select inquiry type - use a more specific selector
    const inquirySelect = screen.getByLabelText(/nature of inquiry/i);
    await user.selectOptions(inquirySelect, 'membership');
    
    // Check consent checkbox
    const consentCheckbox = screen.getByLabelText(/understand that by submitting this form/i, { exact: false });
    await user.click(consentCheckbox);
  });
  
  test('form has required fields', () => {
    render(<ContactForm />);
    
    // Check that name, email, and message fields exist with more specific labels
    expect(screen.getByLabelText(/name or alias/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/nature of inquiry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/understand that by submitting this form/i, { exact: false })).toBeInTheDocument();
  });
});