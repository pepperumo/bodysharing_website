import React from 'react';
import '../../../styles/FormElements.css';

interface ButtonProps {
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outlined';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
}

const Button = ({
  type = 'button',
  onClick,
  children,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  className = ''
}: ButtonProps): React.ReactElement => {
  return (
    <button 
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
