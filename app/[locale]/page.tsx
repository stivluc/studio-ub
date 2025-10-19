import Image from "next/image";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';

export default function Home() {
  const t = useTranslations('home');

  return (
    <div className="min-h-screen p-8 sm:p-12 lg:p-20">
      {/* Header with logos and language switcher */}
      <header className="mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
          <Image
            src="/images/logos/logo-with-text.svg"
            alt="Studio UB Logo with text"
            width={200}
            height={80}
            priority
          />
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <div className="flex gap-4">
              <Image
                src="/images/logos/logo-icon.svg"
                alt="Studio UB Icon"
                width={60}
                height={60}
              />
              <Image
                src="/images/logos/logo-beige.png"
                alt="Studio UB Logo Beige"
                width={60}
                height={60}
              />
              <Image
                src="/images/logos/logo-green.png"
                alt="Studio UB Logo Green"
                width={60}
                height={60}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto space-y-16">
        {/* Typography Testing */}
        <section className="space-y-8">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-4">
              {t('title')}
            </h1>
            <p className="text-xl sm:text-2xl text-[var(--color-cream)]/80">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl">{t('heading2')}</h2>
            <h3 className="text-3xl font-semibold">{t('heading3')}</h3>
            <h4 className="text-2xl font-medium">{t('heading4')}</h4>
            <h5 className="text-xl font-normal">{t('heading5')}</h5>
            <h6 className="text-lg font-light">{t('heading6')}</h6>
          </div>

          <div className="space-y-4">
            <p className="text-base font-light leading-relaxed">
              {t('bodyLight')}
            </p>
            <p className="text-base font-normal leading-relaxed">
              {t('bodyRegular')}
            </p>
            <p className="text-base font-medium leading-relaxed">
              {t('bodyMedium')}
            </p>
          </div>
        </section>

        {/* Color Palette Testing */}
        <section className="space-y-8">
          <h2 className="text-4xl mb-8">{t('colorPalette')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--color-pine)] p-8 rounded-lg border-2 border-[var(--color-cream)]">
              <h3 className="text-2xl mb-2">{t('pinePrimary')}</h3>
              <p className="font-light">#12312a</p>
              <p className="font-light text-sm mt-2">{t('darkBilliardGreen')}</p>
            </div>

            <div className="bg-[var(--color-cream)] text-[var(--color-pine)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">{t('cream')}</h3>
              <p className="font-light">#faecbb</p>
              <p className="font-light text-sm mt-2">{t('beigeAccent')}</p>
            </div>

            <div className="bg-[var(--color-brown)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">{t('brown')}</h3>
              <p className="font-light">#472311</p>
              <p className="font-light text-sm mt-2">{t('darkBrown')}</p>
            </div>

            <div className="bg-[var(--color-light)] text-[var(--color-pine)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2 text-[var(--color-pine)]">{t('light')}</h3>
              <p className="font-light text-[var(--color-pine)]">#f5f1eb</p>
              <p className="font-light text-sm mt-2 text-[var(--color-pine)]">{t('lightBeige')}</p>
            </div>

            <div className="bg-[var(--color-dark)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">{t('dark')}</h3>
              <p className="font-light">#1a1a1a</p>
              <p className="font-light text-sm mt-2">{t('nearBlack')}</p>
            </div>
          </div>
        </section>

        {/* Text Logo Variations */}
        <section className="space-y-8">
          <h2 className="text-4xl mb-8">{t('logoVariations')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-pine)] p-8 rounded-lg border-2 border-[var(--color-cream)]">
              <h3 className="text-xl mb-4">{t('textLogoBeige')}</h3>
              <Image
                src="/images/logos/studio-ub-text-beige.png"
                alt="Studio UB Text Beige"
                width={300}
                height={100}
                className="w-full h-auto"
              />
            </div>

            <div className="bg-[var(--color-cream)] p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-[var(--color-pine)]">{t('textLogoGreen')}</h3>
              <Image
                src="/images/logos/studio-ub-text-green.png"
                alt="Studio UB Text Green"
                width={300}
                height={100}
                className="w-full h-auto"
              />
            </div>
          </div>
        </section>

        {/* Interactive Elements */}
        <section className="space-y-8">
          <h2 className="text-4xl mb-8">{t('interactiveElements')}</h2>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[var(--color-cream)] text-[var(--color-pine)] px-6 py-3 rounded font-medium hover:bg-[var(--color-cream)]/90 transition-colors">
              {t('primaryButton')}
            </button>

            <button className="bg-transparent border-2 border-[var(--color-cream)] text-[var(--color-cream)] px-6 py-3 rounded font-medium hover:bg-[var(--color-cream)] hover:text-[var(--color-pine)] transition-colors">
              {t('secondaryButton')}
            </button>

            <button className="bg-[var(--color-brown)] text-[var(--color-cream)] px-6 py-3 rounded font-medium hover:bg-[var(--color-brown)]/90 transition-colors">
              {t('brownButton')}
            </button>
          </div>

          <div className="space-y-4">
            <a href="#" className="text-[var(--color-cream)] hover:underline underline-offset-4 font-light text-lg">
              {t('linkText')}
            </a>
            <p className="text-[var(--color-cream)]/70 font-light">
              {t('secondaryText')}
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-center text-[var(--color-cream)]/60 font-light">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
}
