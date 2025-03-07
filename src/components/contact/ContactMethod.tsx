import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import '../../styles/Contact.css';

interface ContactMethodProps {
  icon: IconDefinition;
  title: string;
  children: React.ReactNode;
}

const ContactMethod = ({ icon, title, children }: ContactMethodProps): React.ReactElement => {
  return (
    <div className="contact-method">
      <FontAwesomeIcon icon={icon} size="2x" className="contact-method-icon" />
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default ContactMethod;
