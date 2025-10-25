import Image from "next/image";
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';

export default function Home() {
  const t = useTranslations('home');

  const buttonShowcase: Array<{ variant: 'primary' | 'secondary' | 'ghost' | 'danger'; label: string }> = [
    { variant: 'primary', label: t('primaryButton') },
    { variant: 'secondary', label: t('brownButton') },
    { variant: 'ghost', label: t('secondaryButton') },
    { variant: 'danger', label: t('dangerButton') },
  ];

  return (
    <div className="min-h-screen p-8 sm:p-12 lg:p-20 space-y-16">
      <header className="max-w-6xl mx-auto w-full">
        <Card className="p-6 sm:p-8 bg-[var(--color-pine)]/80 border-[var(--color-cream)]/15">
          <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4 sm:gap-6">
              <Image
                src="/images/logos/logo-with-text.svg"
                alt="Studio UB Logo with text"
                width={220}
                height={88}
                priority
                className="w-40 sm:w-52 h-auto"
              />
              <div className="hidden sm:flex gap-4">
                <Image src="/images/logos/logo-icon.svg" alt="Logo icon" width={48} height={48} />
                <Image src="/images/logos/logo-beige.png" alt="Logo beige" width={48} height={48} />
                <Image src="/images/logos/logo-green.png" alt="Logo vert" width={48} height={48} />
              </div>
            </div>
            <div className="self-start sm:self-center">
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>
      </header>

      <main className="max-w-6xl mx-auto w-full space-y-16">
        <section className="space-y-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            {t('title')}
          </h1>
          <p className="text-xl sm:text-2xl text-[var(--color-cream)]/80 max-w-3xl">
            {t('subtitle')}
          </p>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">Interface admin & effets</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card hover interactive className="p-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="crt-scanlines-hover" />
              <CardContent className="relative z-10 space-y-6 p-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 bg-[var(--color-cream)]/10 px-4 py-2 rounded-xl">
                    <svg className="w-6 h-6 text-[var(--color-cream)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="uppercase tracking-wider text-[var(--color-cream)]/70 text-xs">Portfolio</span>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-3xl font-bold">Projet Glitch Vibes</h3>
                    <p className="text-[var(--color-cream)]/70 leading-relaxed">
                      Aperçu d&apos;une carte admin avec effet glitch latéral et hover sonore, fidèle à l&apos;interface en production.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Button size="sm">Voir le projet</Button>
                  <Button size="sm" variant="ghost" liftOnHover={false}>
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card hover interactive className="p-0">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-cream)]/0 to-[var(--color-cream)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="crt-scanlines-hover" />
              <CardContent className="relative z-10 space-y-5 p-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm uppercase tracking-wider text-[var(--color-cream)]/60">Dashboard</span>
                  <Button size="xs" variant="ghost" liftOnHover={false} className="px-3">
                    + Nouveau
                  </Button>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-semibold">Stats en un clin d&apos;œil</h3>
                  <p className="text-[var(--color-cream)]/70 leading-relaxed">
                    Les cartes admin réutilisent le composant <code className="font-mono text-sm">Card</code> avec surcouche glitch, grain et son TV pour une ambiance rétro uniforme.
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-3xl font-bold">24</p>
                    <p className="text-xs text-[var(--color-cream)]/50">Projets</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">126</p>
                    <p className="text-xs text-[var(--color-cream)]/50">Images</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold">14</p>
                    <p className="text-xs text-[var(--color-cream)]/50">Playlists</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">{t('interactiveElements')}</h2>
          <Card className="p-0">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap gap-3">
                {buttonShowcase.map(({ variant, label }) => (
                  <Button key={variant} variant={variant} size="sm">
                    {label}
                  </Button>
                ))}
              </div>
              <div className="space-y-3">
                <a href="#" className="glitch-on-hover inline-flex items-center gap-2 text-[var(--color-cream)]/90 text-lg">
                  <span className="glitch-on-hover-subtle">{t('linkText')}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.25 6.75L6.75 17.25" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.25 6.75h9v9" />
                  </svg>
                </a>
                <p className="text-[var(--color-cream)]/60 max-w-2xl">
                  Hover = glitch + son TV discret grâce au gestionnaire global. Chaque bouton/ lien partage les mêmes primitives.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">Formulaire type</h2>
          <Card className="p-0">
            <CardContent className="p-6 sm:p-8 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Input label="Prénom" placeholder="Ugo" size="sm" />
                <Input label="Email" type="email" placeholder="admin@studioub.ch" size="sm" />
              </div>
              <Textarea label="Description" placeholder="Pitch du projet, notes internes…" rows={5} />
              <div className="flex justify-end">
                <Button type="button">{t('primaryButton')}</Button>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">{t('colorPalette')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-pine)]">
                <h3 className="text-2xl mb-2">{t('pinePrimary')}</h3>
                <p className="font-light">#12312a</p>
                <p className="font-light text-sm mt-2">{t('darkBilliardGreen')}</p>
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-cream)] text-[var(--color-pine)]">
                <h3 className="text-2xl mb-2">{t('cream')}</h3>
                <p className="font-light">#faecbb</p>
                <p className="font-light text-sm mt-2">{t('beigeAccent')}</p>
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-brown)]">
                <h3 className="text-2xl mb-2">{t('brown')}</h3>
                <p className="font-light">#472311</p>
                <p className="font-light text-sm mt-2">{t('darkBrown')}</p>
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-light)] text-[var(--color-pine)]">
                <h3 className="text-2xl mb-2 text-[var(--color-pine)]">{t('light')}</h3>
                <p className="font-light text-[var(--color-pine)]">#f5f1eb</p>
                <p className="font-light text-sm mt-2 text-[var(--color-pine)]">{t('lightBeige')}</p>
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-dark)]">
                <h3 className="text-2xl mb-2">{t('dark')}</h3>
                <p className="font-light">#1a1a1a</p>
                <p className="font-light text-sm mt-2">{t('nearBlack')}</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-semibold">{t('logoVariations')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-pine)]">
                <h3 className="text-xl mb-4">{t('textLogoBeige')}</h3>
                <Image
                  src="/images/logos/studio-ub-text-beige.png"
                  alt="Studio UB Text Beige"
                  width={320}
                  height={120}
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
            <Card className="p-0">
              <CardContent className="p-6 bg-[var(--color-cream)]">
                <h3 className="text-xl mb-4 text-[var(--color-pine)]">{t('textLogoGreen')}</h3>
                <Image
                  src="/images/logos/studio-ub-text-green.png"
                  alt="Studio UB Text Green"
                  width={320}
                  height={120}
                  className="w-full h-auto"
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto text-center text-[var(--color-cream)]/60 font-light">
        <p>{t('footerText')}</p>
      </footer>
    </div>
  );
}
