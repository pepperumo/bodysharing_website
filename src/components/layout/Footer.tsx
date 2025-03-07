import React from 'react';
import { Link } from 'react-router-dom';

const Footer = (): React.ReactElement => {
  return (
    <footer>
      <div className="footer-content container">
        <div className="footer-section">
          <h3>BodySharing</h3>
          <p>A community founded on consent, connection,<br/>and exploration.</p>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/how-it-works">How It Works</Link></li>
            <li><Link to="/consent">Consent & Guidelines</Link></li>
            <li><Link to="/testimonials">Testimonials</Link></li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Connect</h3>
          <p>Berlin, Germany</p>
          <p>© {new Date().getFullYear()} BodySharing. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
