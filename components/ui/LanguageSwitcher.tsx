'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { routing } from '@/i18n/routing';
import { Button } from './Button';

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
        <Button
          key={loc}
          type="button"
          size="xs"
          liftOnHover={false}
          variant={locale === loc ? 'primary' : 'ghost'}
          className={`font-medium ${locale === loc ? 'shadow-md' : 'text-[var(--color-cream)]'}`}
          onClick={() => handleLocaleChange(loc)}
          aria-label={`Switch to ${loc === 'fr' ? t('french') : t('english')}`}
        >
          {loc.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}
