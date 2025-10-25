'use client';

import { useState, useRef, useEffect } from 'react';

type DropdownProps = {
  trigger: React.ReactNode;
  children: React.ReactNode;
};

export function Dropdown({ trigger, children }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-cream)]/10 hover:bg-[var(--color-cream)]/20 text-[var(--color-cream)] font-semibold text-base rounded-xl border border-[var(--color-cream)]/20 hover:border-[var(--color-cream)]/40 transition-all duration-200"
      >
        {trigger}
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-56 z-50">
          {/* Arrow pointing up to the button */}
          <div className="flex justify-end pr-[22px]">
            <div className="relative">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[8px] border-b-[var(--color-pine)]"></div>
              <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[9px] border-l-transparent border-r-[9px] border-r-transparent border-b-[9px] border-b-[var(--color-cream)]/20"></div>
            </div>
          </div>
          <div className="bg-[var(--color-pine)] border border-[var(--color-cream)]/20 rounded-xl shadow-lg overflow-hidden -mt-[1px]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

type DropdownItemProps = {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  type?: 'button' | 'submit';
};

export function DropdownItem({ children, onClick, href, type = 'button' }: DropdownItemProps) {
  const className = "flex items-center gap-3 w-full text-left px-4 py-3 text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10 transition-colors duration-200 font-medium cursor-pointer";

  if (href) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} type={type} className={className}>
      {children}
    </button>
  );
}
