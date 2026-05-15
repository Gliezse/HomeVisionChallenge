import {
  memo,
  useCallback,
  useId,
  useMemo,
  useState,
  type PointerEvent,
} from 'react';
import { useFavourites } from '../../favourites/FavouritesContext';
import type { House } from '../../types/house';
import { formatPriceUSD } from '../../utils/format';
import { Tooltip } from '../ui/Tooltip';

const DEFAULT_INQUIRY_EMAIL = 'inquiry@homevision-fake-address.com';
const DEFAULT_INQUIRY_SUBJECT = 'Inquiry about a house';

const inquiryEmail =
  import.meta.env.VITE_INQUIRY_EMAIL || DEFAULT_INQUIRY_EMAIL;
const inquirySubject =
  import.meta.env.VITE_INQUIRY_SUBJECT || DEFAULT_INQUIRY_SUBJECT;

function buildInquiryBody(house: House): string {
  return [
    "Hi! I'm interested in talking about this property I found in your website",
    '',
    `Address: ${house.address}`,
    `Homeowner: ${house.homeowner}`,
    `Price: ${formatPriceUSD(house.price)}`,
    `Property ID: ${house.id}`,
    `Photo URL: ${house.photoURL}`,
  ].join('\n');
}

function inquiryMailtoHref(house: House): string {
  const params = new URLSearchParams({
    subject: inquirySubject,
    body: buildInquiryBody(house),
  });
  const query = params.toString().replaceAll('+', '%20');
  return `mailto:${inquiryEmail}?${query}`;
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  );
}

const HEART_PATH =
  'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z';

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      className="size-5 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d={HEART_PATH}
        fill={filled ? 'currentColor' : 'none'}
        stroke={filled ? 'none' : 'currentColor'}
        strokeWidth={filled ? undefined : 1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const ACTION_CHIP =
  'flex size-10 shrink-0 items-center justify-center rounded-full bg-white/90 shadow-sm ring-1 ring-slate-200/80';

const ACTION_PEEK =
  'transition-[opacity,color] duration-200 ease-out focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-purple)] md:pointer-events-none md:opacity-0 md:group-has-[:focus-visible]:pointer-events-auto md:group-has-[:focus-visible]:opacity-100 md:group-hover:pointer-events-auto md:group-hover:opacity-100';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect fill="#e2e8f0" width="640" height="480"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="18">No photo</text></svg>`,
  );

export type HouseCardProps = {
  house: House;
  className?: string;
};

function HouseCardInner({ house, className = '' }: HouseCardProps) {
  const [src, setSrc] = useState(house.photoURL);
  const { isFavourite, toggleFavourite } = useFavourites();
  const isFav = isFavourite(house.id);
  const mailtoHref = useMemo(() => inquiryMailtoHref(house), [house]);
  const listingSummaryId = useId();
  const emailActionId = useId();
  const emailHelpId = useId();
  const favActionId = useId();

  const listingSummaryText = useMemo(
    () =>
      `Address: ${house.address}. Homeowner: ${house.homeowner}. Price: ${formatPriceUSD(house.price)}.`,
    [house.address, house.homeowner, house.price],
  );

  // Mouse/tap puts focus on the heart or mail control, but most browsers do not mark that
  // focus as :focus-visible. The focused control then stays the activeElement after the
  // cursor leaves the card, which skews hover/focus styling and tooltips. On pointer leave
  // we drop that focus; if the user actually moved focus here with the keyboard, the control
  // matches :focus-visible and we leave focus alone.
  const blurPointerFocusOnLeave = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const root = e.currentTarget;
      const active = document.activeElement;
      if (!(active instanceof HTMLElement) || !root.contains(active)) return;
      try {
        if (active.matches(':focus-visible')) return;
      } catch {
        /* :focus-visible in matches() unsupported */
      }
      active.blur();
    },
    [],
  );

  return (
    <article
      aria-labelledby={listingSummaryId}
      onPointerLeave={blurPointerFocusOnLeave}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white border border-slate-300 transition-colors duration-300 ease-out ${className}`.trim()}
    >
      <span id={listingSummaryId} className="sr-only">
        {listingSummaryText}
      </span>
      <span id={emailActionId} className="sr-only">
        Send email about this property:
      </span>
      <span id={emailHelpId} className="sr-only">
        Opens your email app with a draft message about this listing.
      </span>
      <span id={favActionId} className="sr-only">
        {isFav ? 'Remove from favourites.' : 'Add to favourites.'}
      </span>
      <div className="relative aspect-square w-full shrink-0">
        <div className="absolute inset-0 overflow-hidden rounded-tl-xl rounded-tr-xl bg-slate-100">
          <img
            src={src}
            alt=""
            loading="lazy"
            width={400}
            height={400}
            className="h-full w-full object-cover"
            onError={() => setSrc(PLACEHOLDER_IMAGE)}
          />
        </div>
        <div className="absolute right-2 top-2 z-10 flex flex-col gap-2">
          <Tooltip
            label={isFav ? 'Remove from favourites' : 'Add to favourites'}
          >
            <button
              type="button"
              aria-pressed={isFav}
              aria-labelledby={`${favActionId} ${listingSummaryId}`}
              className={`${ACTION_CHIP} ${
                isFav
                  ? 'text-[var(--color-purple)] opacity-100 cursor-pointer'
                  : `text-gray-500 hover:text-[var(--color-purple)] cursor-pointer ${ACTION_PEEK}`
              }`}
              onClick={() => toggleFavourite(house.id)}
            >
              <HeartIcon filled={isFav} />
            </button>
          </Tooltip>
          <Tooltip label="Email about this listing">
            <a
              href={mailtoHref}
              aria-labelledby={`${emailActionId} ${listingSummaryId}`}
              aria-describedby={emailHelpId}
              className={`${ACTION_CHIP} text-gray-500 transition-[opacity,color] duration-200 ease-out hover:text-[var(--color-purple)] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-purple)] ${ACTION_PEEK}`}
            >
              <MailIcon className="size-5" />
            </a>
          </Tooltip>
        </div>
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 p-4 ">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
          {house.address}
        </h2>
        <p className="line-clamp-1 text-sm text-gray-600 sm:text-base">
          {house.homeowner}
        </p>
        <p className="text-xl tracking-tighter font-semibold normal-nums sm:text-2xl">
          {formatPriceUSD(house.price)}
        </p>
      </div>
    </article>
  );
}

export const HouseCard = memo(HouseCardInner);
