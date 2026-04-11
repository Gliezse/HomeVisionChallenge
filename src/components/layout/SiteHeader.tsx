import { useEffect, useState } from "react";
import { Container } from "./Container";

const SCROLL_THRESHOLD_PX = 16;

/**
 * Sticky header: large at page top, compact after scroll (smooth transition).
 * `data-site-header` lets the list virtualizer remeasure when header height changes.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD_PX);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-site-header
      className={`sticky top-0 z-50 border-b transition-[padding,box-shadow,background-color,border-color] duration-300 ease-out ${
        scrolled
          ? "border-slate-200/80 bg-white/75 py-3 shadow-md backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
          : "border-transparent bg-gray-50 py-8 shadow-none"
      }`}
    >
      <Container>
        <div
          className={`font-semibold tracking-tight text-slate-900 transition-[font-size,line-height] duration-300 ease-out ${
            scrolled ? "text-lg" : "text-2xl sm:text-3xl"
          }`}
        >
          Homes
        </div>
        <p
          className={`text-gray-600 transition-[margin,font-size,opacity] duration-300 ease-out ${
            scrolled
              ? "mt-1 line-clamp-1 text-xs opacity-90"
              : "mt-3 max-w-2xl text-sm leading-relaxed opacity-100"
          }`}
        >
          Infinite scroll with virtualization. If the connection isn’t stable,
          we retry automatically — you can try again anytime if needed.
        </p>
      </Container>
    </header>
  );
}
