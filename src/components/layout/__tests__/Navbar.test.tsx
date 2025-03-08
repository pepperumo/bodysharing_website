import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

// Helper function to render component with router
const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Navbar Component', () => {
  test('renders the navbar with all navigation links', () => {
    renderWithRouter(<Navbar />);
    
    // Check if the logo/brand is present
    expect(screen.getByText(/BodySharing/i)).toBeInTheDocument();
    
    // Check if all navigation links are present
    expect(screen.getByText(/home/i)).toBeInTheDocument();
    expect(screen.getByText(/how it works/i)).toBeInTheDocument();
    expect(screen.getByText(/experience/i)).toBeInTheDocument();
    expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
  });

  test('mobile menu toggle is present', async () => {
    renderWithRouter(<Navbar />);
    
    // Find the menu-toggle div
    const menuToggle = screen.getByRole('img', { hidden: true }) || 
                       document.querySelector('.menu-toggle');
    
    expect(menuToggle).toBeInTheDocument();
  });
});