import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import '../../styles/Navbar.css';

const Navbar = (): React.ReactElement => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    // Add no-scroll class to body when menu is open
    if (!menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  // Close the menu when a link is clicked or when route changes
  useEffect(() => {
    setMenuOpen(false);
    document.body.style.overflow = 'auto';
  }, [location]);
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <h1>BodySharing</h1>
      </div>
      
      <div className="menu-toggle" onClick={toggleMenu}>
        <FontAwesomeIcon icon={menuOpen ? faTimes : faBars} />
      </div>
      
      <ul className={`nav-menu ${menuOpen ? 'active' : ''}`}>
        <li className="nav-item">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            Home
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/how-it-works" 
            className={location.pathname === '/how-it-works' ? 'active' : ''}
          >
            How It Works
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/consent" 
            className={location.pathname === '/consent' ? 'active' : ''}
          >
            Consent & Guidelines
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/experience" 
            className={location.pathname === '/experience' ? 'active' : ''}
          >
            The Experience
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/after-party" 
            className={location.pathname === '/after-party' ? 'active' : ''}
          >
            After the Party
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/testimonials" 
            className={location.pathname === '/testimonials' ? 'active' : ''}
          >
            Testimonials
          </Link>
        </li>
        <li className="nav-item">
          <Link 
            to="/contact" 
            className={location.pathname === '/contact' ? 'active' : ''}
          >
            Contact Us
          </Link>
        </li>
      </ul>
      
      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </nav>
  );
};

export default Navbar;
