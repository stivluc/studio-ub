import { ReactNode } from 'react';

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
};

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        bg-gradient-to-br from-[var(--color-dark)] to-[var(--color-dark)]/80
        rounded-2xl border border-[var(--color-cream)]/10
        shadow-lg backdrop-blur-sm
        ${hover ? 'hover:border-[var(--color-cream)]/30 hover:shadow-2xl hover:shadow-[var(--color-cream)]/5 transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

type CardHeaderProps = {
  children: ReactNode;
  className?: string;
};

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return <div className={`p-8 ${className}`}>{children}</div>;
}

type CardTitleProps = {
  children: ReactNode;
  className?: string;
};

export function CardTitle({ children, className = '' }: CardTitleProps) {
  return (
    <h2 className={`text-3xl font-bold text-[var(--color-cream)] tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

type CardDescriptionProps = {
  children: ReactNode;
  className?: string;
};

export function CardDescription({ children, className = '' }: CardDescriptionProps) {
  return <p className={`text-[var(--color-cream)]/60 leading-relaxed ${className}`}>{children}</p>;
}

type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={`p-8 ${className}`}>{children}</div>;
}
