import React from 'react';
import '../../../styles/FormElements.css';

interface FormFieldProps {
  label: string;
  name: string;
  id?: string;
  type?: 'text' | 'email' | 'password' | 'number';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
}

const FormField = ({
  label,
  name,
  id = name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder
}: FormFieldProps): React.ReactElement => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <input 
        type={type}
        id={id}
        name={name}
        className={`form-control ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default FormField;
