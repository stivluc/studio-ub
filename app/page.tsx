import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-12 lg:p-20">
      {/* Header with logos */}
      <header className="mb-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 mb-12">
          <Image
            src="/images/logos/logo-with-text.svg"
            alt="Studio UB Logo with text"
            width={200}
            height={80}
            priority
          />
          <div className="flex gap-6">
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
      </header>

      <main className="max-w-6xl mx-auto space-y-16">
        {/* Typography Testing */}
        <section className="space-y-8">
          <div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl mb-4">
              Studio UB Theme Test
            </h1>
            <p className="text-xl sm:text-2xl text-[var(--color-cream)]/80">
              Testing Semplicita Pro font and brand colors
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-4xl">Heading Level 2 - Bold (700)</h2>
            <h3 className="text-3xl font-semibold">Heading Level 3 - SemiBold (600)</h3>
            <h4 className="text-2xl font-medium">Heading Level 4 - Medium (500)</h4>
            <h5 className="text-xl font-normal">Heading Level 5 - Regular (400)</h5>
            <h6 className="text-lg font-light">Heading Level 6 - Light (300)</h6>
          </div>

          <div className="space-y-4">
            <p className="text-base font-light leading-relaxed">
              This is body text using Semplicita Pro Light (300). Lorem ipsum dolor sit amet,
              consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
            </p>
            <p className="text-base font-normal leading-relaxed">
              This is body text using Semplicita Pro Regular (400). Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </p>
            <p className="text-base font-medium leading-relaxed">
              This is body text using Semplicita Pro Medium (500). Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </section>

        {/* Color Palette Testing */}
        <section className="space-y-8">
          <h2 className="text-4xl mb-8">Color Palette</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[var(--color-pine)] p-8 rounded-lg border-2 border-[var(--color-cream)]">
              <h3 className="text-2xl mb-2">Pine (Primary)</h3>
              <p className="font-light">#12312a</p>
              <p className="font-light text-sm mt-2">Dark billiard green</p>
            </div>

            <div className="bg-[var(--color-cream)] text-[var(--color-pine)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">Cream</h3>
              <p className="font-light">#faecbb</p>
              <p className="font-light text-sm mt-2">Beige/cream accent</p>
            </div>

            <div className="bg-[var(--color-brown)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">Brown</h3>
              <p className="font-light">#472311</p>
              <p className="font-light text-sm mt-2">Dark brown</p>
            </div>

            <div className="bg-[var(--color-light)] text-[var(--color-pine)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2 text-[var(--color-pine)]">Light</h3>
              <p className="font-light text-[var(--color-pine)]">#f5f1eb</p>
              <p className="font-light text-sm mt-2 text-[var(--color-pine)]">Light beige</p>
            </div>

            <div className="bg-[var(--color-dark)] p-8 rounded-lg">
              <h3 className="text-2xl mb-2">Dark</h3>
              <p className="font-light">#1a1a1a</p>
              <p className="font-light text-sm mt-2">Near black</p>
            </div>
          </div>
        </section>

        {/* Text Logo Variations */}
        <section className="space-y-8">
          <h2 className="text-4xl mb-8">Logo Variations</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[var(--color-pine)] p-8 rounded-lg border-2 border-[var(--color-cream)]">
              <h3 className="text-xl mb-4">Text Logo - Beige</h3>
              <Image
                src="/images/logos/studio-ub-text-beige.png"
                alt="Studio UB Text Beige"
                width={300}
                height={100}
                className="w-full h-auto"
              />
            </div>

            <div className="bg-[var(--color-cream)] p-8 rounded-lg">
              <h3 className="text-xl mb-4 text-[var(--color-pine)]">Text Logo - Green</h3>
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
          <h2 className="text-4xl mb-8">Interactive Elements</h2>

          <div className="flex flex-wrap gap-4">
            <button className="bg-[var(--color-cream)] text-[var(--color-pine)] px-6 py-3 rounded font-medium hover:bg-[var(--color-cream)]/90 transition-colors">
              Primary Button
            </button>

            <button className="bg-transparent border-2 border-[var(--color-cream)] text-[var(--color-cream)] px-6 py-3 rounded font-medium hover:bg-[var(--color-cream)] hover:text-[var(--color-pine)] transition-colors">
              Secondary Button
            </button>

            <button className="bg-[var(--color-brown)] text-[var(--color-cream)] px-6 py-3 rounded font-medium hover:bg-[var(--color-brown)]/90 transition-colors">
              Brown Button
            </button>
          </div>

          <div className="space-y-4">
            <a href="#" className="text-[var(--color-cream)] hover:underline underline-offset-4 font-light text-lg">
              This is a text link with hover underline
            </a>
            <p className="text-[var(--color-cream)]/70 font-light">
              This text uses 70% opacity for secondary information
            </p>
          </div>
        </section>
      </main>

      <footer className="mt-20 text-center text-[var(--color-cream)]/60 font-light">
        <p>Studio UB - Theme Configuration Test</p>
      </footer>
    </div>
  );
}
