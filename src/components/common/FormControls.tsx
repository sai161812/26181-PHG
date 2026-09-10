import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  id,
  style,
  ...rest
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
      {label && (
        <label htmlFor={inputId} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: '14px',
          borderRadius: 'var(--radius-md)',
          border: error ? '1px solid var(--risk-critical)' : '1px solid var(--border)',
          backgroundColor: 'var(--surface)',
          color: 'var(--text)',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
          ...style
        }}
        {...rest}
      />
      {error ? (
        <span style={{ fontSize: '12px', color: 'var(--risk-critical)', fontWeight: 500 }}>{error}</span>
      ) : helperText ? (
        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{helperText}</span>
      ) : null}
    </div>
  );
};

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export const Toggle: React.FC<ToggleProps> = ({
  label,
  description,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        padding: '12px 0',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1
      }}
    >
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>{label}</div>
        {description && (
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {description}
          </div>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: '12px',
          backgroundColor: checked ? 'var(--teal-700)' : 'var(--border)',
          position: 'relative',
          padding: '2px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none',
          transition: 'background-color var(--transition-fast)'
        }}
      >
        <span
          style={{
            display: 'block',
            width: '20px',
            height: '20px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            transform: checked ? 'translateX(20px)' : 'translateX(0)',
            transition: 'transform var(--transition-fast)'
          }}
        />
      </button>
    </label>
  );
};
