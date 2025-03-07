import React from 'react';
import '../../../styles/FormElements.css';

interface CheckboxFieldProps {
  label: React.ReactNode;
  name: string;
  id?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const CheckboxField = ({
  label,
  name,
  id = name,
  checked,
  onChange,
  error
}: CheckboxFieldProps): React.ReactElement => {
  return (
    <div className="checkbox-group">
      <div className="checkbox-wrapper">
        <input 
          type="checkbox" 
          id={id} 
          name={name}
          checked={checked}
          onChange={onChange}
          className="checkbox-input"
        />
        <label htmlFor={id} className="checkbox-label">{label}</label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CheckboxField;
