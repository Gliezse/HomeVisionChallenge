import { useEffect, useState, type ComponentPropsWithoutRef } from "react";
import { Container } from "./Container";

const SCROLL_THRESHOLD_PX = 30;

/** Company wordmark (source: HomeVision marketing CDN, vendored to `/public/logo.svg`). */
const LOGO_SRC = "/logo.svg";

const HOMEVISION_ABOUT_URL = "https://homevision.co/company";

type SiteHeaderRoot = "header" | "div";

type HeaderContentProps = {
  as?: SiteHeaderRoot;
  scrolled: boolean;
} & Omit<ComponentPropsWithoutRef<"div">, "as" | "scrolled">;

function HeaderContent({
  as: Root = "header",
  scrolled,
  className = "",
  ...rest
}: HeaderContentProps) {
  const shell = `w-full transition-[padding,box-shadow,background-color,border-color] duration-300 ease-out ${
    scrolled
      ? "border-slate-200/80 bg-white/75 py-3 shadow-xs backdrop-blur-md supports-[backdrop-filter]:bg-white/60"
      : "bg-white py-4 shadow-none border-b border-slate-200"
  }`;

  return (
    <Root
      {...(Root === "header" ? { "data-site-header": true } : {})}
      className={`${shell} ${className}`.trim()}
      {...rest}
    >
      <Container>
        <div
          className={`flex flex-col transition-[align-items] duration-300 ease-out ${
            scrolled ? "items-center" : "items-stretch"
          }`}
        >
          <div
            className={`flex w-full min-w-0 items-center gap-4 transition-[justify-content] duration-300 ease-out ${
              scrolled ? "justify-center" : "justify-between"
            }`}
          >
            <img
              src={LOGO_SRC}
              alt="HomeVision"
              width={109}
              height={32}
              decoding="async"
              className={`object-contain object-left transition-[height,width,margin] duration-300 ease-out ${
                scrolled
                  ? "mx-auto h-7 w-auto sm:h-8"
                  : "h-9 w-auto max-w-[min(100%,280px)] sm:h-11"
              }`}
            />
            {!scrolled && (
              <a
                href={HOMEVISION_ABOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-base font-bold transition-colors hover:text-[var(--color-purple)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-purple)]"
              >
                About Us
              </a>
            )}
          </div>
        </div>
      </Container>
    </Root>
  );
}

/**
 * Sticky header: large at page top, compact after scroll (smooth transition).
 * `data-site-header` is set on the real header for list virtualizer measurement.
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
    <>
      <HeaderContent
        as="div"
        scrolled={false}
        aria-hidden
        className="invisible pointer-events-none"
      />
      <HeaderContent
        as="header"
        scrolled={scrolled}
        className="fixed top-0 z-50"
      />
    </>
  );
}
