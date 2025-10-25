import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

type InputSize = 'sm' | 'md' | 'lg';

const inputSizeStyles: Record<InputSize, string> = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3 text-base',
  lg: 'px-5 py-4 text-lg',
};

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  size?: InputSize;
  wrapperClassName?: string;
  labelClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      size = 'md',
      className = '',
      wrapperClassName = '',
      labelClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-2 ${wrapperClassName}`}>
        {label && (
          <label className={`block text-[var(--color-cream)] font-medium ${labelClassName}`}>
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20
            rounded-xl text-[var(--color-cream)]
            focus:outline-none focus:border-[var(--color-cream)]/50 focus:ring-2 focus:ring-[var(--color-cream)]/20
            placeholder:text-[var(--color-cream)]/30
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${inputSizeStyles[size]}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  size?: InputSize;
  wrapperClassName?: string;
  labelClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      size = 'md',
      className = '',
      wrapperClassName = '',
      labelClassName = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`space-y-2 ${wrapperClassName}`}>
        {label && (
          <label className={`block text-[var(--color-cream)] font-medium ${labelClassName}`}>
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20
            rounded-xl text-[var(--color-cream)]
            focus:outline-none focus:border-[var(--color-cream)]/50 focus:ring-2 focus:ring-[var(--color-cream)]/20
            placeholder:text-[var(--color-cream)]/30
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${inputSizeStyles[size]}
            ${className}
          `}
          {...props}
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
