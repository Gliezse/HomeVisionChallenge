import { useCallback } from 'react';
import { HouseTable } from '../components/house/HouseTable';
import { Container } from '../components/layout/Container';
import { SiteHeader } from '../components/layout/SiteHeader';
import { Button } from '../components/ui/Button';

const HOUSE_LISTINGS_SECTION_ID = 'house-listings';

export function Home() {
  const scrollToHouseListings = useCallback(() => {
    const el = document.getElementById(HOUSE_LISTINGS_SECTION_ID);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let didFocus = false;
    const focusListings = () => {
      if (didFocus) return;
      didFocus = true;
      el.focus({ preventScroll: true });
    };

    const root = document.documentElement;
    const onScrollEnd = () => focusListings();
    root.addEventListener('scrollend', onScrollEnd, { once: true });
    window.setTimeout(() => {
      root.removeEventListener('scrollend', onScrollEnd);
      focusListings();
    }, 800);
  }, []);

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main>
        <div className="bg-[var(--bg-purple-light)] w-[100%]">
          <div className="flex items-center justify-center py-30 px-4">
            <div className="mx-auto max-w-2xl w-[100%] md:w-[50%] sm:w-[75%]">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-6">
                Find your dream home.
                <br />
                <span className="text-[var(--color-purple)]">
                  Fast and easy.
                </span>
              </h1>
              <p className="text-base leading-relaxed text-gray-600 mb-8">
                Browse our catalog and compare homes on your own timeline. When
                you’re ready, email us the address or a short note about what
                caught your eye—we’ll follow up and help you with the next
                steps.
              </p>
              <Button
                type="button"
                onClick={scrollToHouseListings}
                aria-controls={HOUSE_LISTINGS_SECTION_ID}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
        <section
          id={HOUSE_LISTINGS_SECTION_ID}
          tabIndex={-1}
          aria-label="House listings"
          className="scroll-mt-24 outline-none focus:outline-none md:scroll-mt-28"
        >
          <Container className="py-15">
            <HouseTable />
          </Container>
        </section>
      </main>
    </div>
  );
}
