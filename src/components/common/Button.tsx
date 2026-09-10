import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  style = {},
  disabled,
  ...rest
}) => {
  const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
    sm: { padding: '6px 10px', fontSize: '13px', borderRadius: 'var(--radius-md)' },
    md: { padding: '8px 14px', fontSize: '14px', borderRadius: 'var(--radius-md)' },
    lg: { padding: '10px 18px', fontSize: '15px', borderRadius: 'var(--radius-md)' }
  };

  const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
    primary: {
      backgroundColor: 'var(--teal-700)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      fontWeight: 600,
      boxShadow: 'var(--shadow)'
    },
    secondary: {
      backgroundColor: 'var(--teal-100)',
      color: 'var(--teal-700)',
      border: '1px solid #BFDDD6',
      fontWeight: 600
    },
    outline: {
      backgroundColor: 'var(--surface)',
      color: 'var(--text)',
      border: '1px solid var(--border)',
      fontWeight: 500
    },
    danger: {
      backgroundColor: 'var(--risk-critical)',
      color: '#FFFFFF',
      border: '1px solid transparent',
      fontWeight: 600
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
      fontWeight: 500
    }
  };

  return (
    <button
      {...rest}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.55 : 1,
        transition: 'background-color var(--transition-fast), border-color var(--transition-fast)',
        fontFamily: 'inherit',
        lineHeight: 1.2,
        ...sizeStyles[size],
        ...variantStyles[variant],
        ...style
      }}
    >
      {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
