import React from 'react';
import '../../../styles/FormElements.css';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  name: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

const SelectField = ({
  label,
  name,
  id = name,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select an option'
}: SelectFieldProps): React.ReactElement => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <select 
        id={id}
        name={name}
        className={`form-control ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
      >
        <option value="">{placeholder}</option>
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SelectField;
