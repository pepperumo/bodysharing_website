import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../components/pages/Home';
import Contact from '../components/pages/Contact';
import HowItWorks from '../components/pages/HowItWorks';
import Testimonials from '../components/pages/Testimonials';
import Experience from '../components/pages/Experience';

// Helper function to wrap component with router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Page Components', () => {
  test('Home page renders correctly', () => {
    renderWithRouter(<Home />);
    expect(screen.getByRole('heading', { name: /bodysharing/i })).toBeInTheDocument();
  });
  
  test('How It Works page renders correctly', () => {
    renderWithRouter(<HowItWorks />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/how it works/i);
  });
  
  test('Experience page renders correctly', () => {
    renderWithRouter(<Experience />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/experience/i);
  });
  
  test('Testimonials page renders correctly', () => {
    renderWithRouter(<Testimonials />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/testimonials/i);
  });
  
  test('Contact page renders correctly', () => {
    renderWithRouter(<Contact />);
    // Check if form elements are present
    expect(screen.getByLabelText(/name or alias/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your message/i)).toBeInTheDocument();
  });
});