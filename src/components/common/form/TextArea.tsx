import React from 'react';
import '../../../styles/FormElements.css';

interface TextAreaProps {
  label: string;
  name: string;
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}

const TextArea = ({
  label,
  name,
  id = name,
  value,
  onChange,
  error,
  placeholder,
  rows = 5
}: TextAreaProps): React.ReactElement => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">{label}</label>
      <textarea 
        id={id}
        name={name}
        className={`form-control ${error ? 'error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
      ></textarea>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default TextArea;
