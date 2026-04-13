import { useCallback, useRef, useState } from 'react';
import { HouseTable } from '../components/house/HouseTable';
import { Container } from '../components/layout/Container';
import { SiteHeader } from '../components/layout/SiteHeader';
import { Button } from '../components/ui/Button';
import { ScrollToTopButton } from '../components/ui/ScrollToTopButton';
import { TutorialModal } from '../components/ui/TutorialModal';

const HOUSE_LISTINGS_SECTION_ID = 'house-listings';

export function Home() {
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const tutorialTriggerRef = useRef<HTMLButtonElement>(null);

  const closeTutorial = useCallback(() => setTutorialOpen(false), []);

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
        <div className="bg-white w-full relative">
          <div className="pointer-events-none absolute top-0 left-0 w-full h-full">
            <div className="h-full mx-auto max-w-7xl px-4">
              <div className="grid grid-cols-4 h-full border-l border-r border-gray-200 w-full">
                <div className="bg-transparent border-r border-gray-200"></div>
                <div className="bg-transparent border-r border-gray-200"></div>
                <div className="bg-transparent border-r border-gray-200"></div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center py-30 px-4 relative z-10">
            <div className="mx-auto max-w-2xl w-[100%] md:w-[50%] sm:w-[75%]">
              <h1 className="text-4xl font-extrabold lg:text-6xl sm:text-5xl mb-6 tracking-[var(--tracking-tightest)]">
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
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={scrollToHouseListings}
                  aria-controls={HOUSE_LISTINGS_SECTION_ID}
                >
                  Get Started
                </Button>
                <Button
                  ref={tutorialTriggerRef}
                  type="button"
                  variant="secondary"
                  aria-haspopup="dialog"
                  aria-expanded={tutorialOpen}
                  onClick={() => setTutorialOpen(true)}
                >
                  How it works
                </Button>
              </div>
            </div>
          </div>
        </div>
        <TutorialModal
          open={tutorialOpen}
          onClose={closeTutorial}
          triggerRef={tutorialTriggerRef}
        />
        <section
          id={HOUSE_LISTINGS_SECTION_ID}
          tabIndex={-1}
          aria-label="House listings"
          className="scroll-mt-24 outline-none focus:outline-none md:scroll-mt-28 bg-[var(--bg-purple-light)]"
        >
          <Container className="py-15">
            <h2 className="text-3xl font-bold sm:text-4xl mb-6 tracking-[var(--tracking-tightest)] text-center mb-15">
              Latest homes for sale.
            </h2>
            <HouseTable />
          </Container>
        </section>
      </main>
      <ScrollToTopButton listingsSectionId={HOUSE_LISTINGS_SECTION_ID} />
    </div>
  );
}
