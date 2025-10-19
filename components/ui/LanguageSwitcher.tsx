'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';

export default function LanguageSwitcher() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center gap-2 bg-[var(--color-cream)]/10 rounded-lg p-1 border border-[var(--color-cream)]/20">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleLocaleChange(loc)}
          className={`
            px-4 py-2 rounded-md font-medium transition-all duration-200
            ${
              locale === loc
                ? 'bg-[var(--color-cream)] text-[var(--color-pine)] shadow-md'
                : 'text-[var(--color-cream)] hover:bg-[var(--color-cream)]/10'
            }
          `}
          aria-label={`Switch to ${loc === 'fr' ? t('french') : t('english')}`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
