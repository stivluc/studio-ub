import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-[var(--color-cream)] font-medium">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20
            rounded-xl px-4 py-3 text-[var(--color-cream)]
            focus:outline-none focus:border-[var(--color-cream)]/50 focus:ring-2 focus:ring-[var(--color-cream)]/20
            placeholder:text-[var(--color-cream)]/30
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
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
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-[var(--color-cream)] font-medium">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={`
            w-full bg-[var(--color-pine)]/30 border border-[var(--color-cream)]/20
            rounded-xl px-4 py-3 text-[var(--color-cream)]
            focus:outline-none focus:border-[var(--color-cream)]/50 focus:ring-2 focus:ring-[var(--color-cream)]/20
            placeholder:text-[var(--color-cream)]/30
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}
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
