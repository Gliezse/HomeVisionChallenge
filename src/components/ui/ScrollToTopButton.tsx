import { useCallback, useEffect, useState } from 'react';
import { Button } from './Button';

/** ~2 virtualized listing rows on mobile (see HouseTable row estimates). */
const SCROLL_PAST_LISTINGS_PX = 900;

type ScrollToTopButtonProps = {
  /** Must match the listings section `id` (e.g. on Home). */
  listingsSectionId?: string;
};

export function ScrollToTopButton({
  listingsSectionId = 'house-listings',
}: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  const updateVisible = useCallback(() => {
    const el = document.getElementById(listingsSectionId);
    const scrollY = window.scrollY;
    if (!el) {
      setVisible(scrollY >= SCROLL_PAST_LISTINGS_PX * 2);
      return;
    }
    const sectionTop = el.getBoundingClientRect().top + scrollY;
    setVisible(scrollY >= sectionTop + SCROLL_PAST_LISTINGS_PX);
  }, [listingsSectionId]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateVisible();
      });
    };
    updateVisible();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [updateVisible]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-40 flex justify-center md:justify-end"
      style={{
        bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
        left: 0,
        right: 0,
        paddingLeft: 'max(1rem, env(safe-area-inset-left, 0px))',
        paddingRight: 'max(1rem, env(safe-area-inset-right, 0px))',
      }}
    >
      <Button
        type="button"
        onClick={scrollToTop}
        tabIndex={visible ? 0 : -1}
        className={`pointer-events-auto shadow-lg transition-[opacity,transform] duration-200 ease-out ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-2 opacity-0'
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 shrink-0"
          aria-hidden
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
        Scroll to top
      </Button>
    </div>
  );
}
