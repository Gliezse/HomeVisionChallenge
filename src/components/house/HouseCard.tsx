import { memo, useId, useMemo, useState } from "react";
import type { House } from "../../types/house";
import { formatPriceUSD } from "../../utils/format";

const INQUIRY_EMAIL = "inquiry@homevision-fake-address.com";
const INQUIRY_SUBJECT = "Inquiry about a house";

function buildInquiryBody(house: House): string {
  return [
    "Hi! I'm interested in talking about this property I found in your website",
    "",
    `Address: ${house.address}`,
    `Homeowner: ${house.homeowner}`,
    `Price: ${formatPriceUSD(house.price)}`,
    `Property ID: ${house.id}`,
    `Photo URL: ${house.photoURL}`,
  ].join("\n");
}

function inquiryMailtoHref(house: House): string {
  const params = new URLSearchParams({
    subject: INQUIRY_SUBJECT,
    body: buildInquiryBody(house),
  });
  return `mailto:${INQUIRY_EMAIL}?${params.toString()}`;
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

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="480" viewBox="0 0 640 480"><rect fill="#e2e8f0" width="640" height="480"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="18">No photo</text></svg>`
  );

export type HouseCardProps = {
  house: House;
  className?: string;
};

function HouseCardInner({ house, className = "" }: HouseCardProps) {
  const [src, setSrc] = useState(house.photoURL);
  const mailtoHref = useMemo(() => inquiryMailtoHref(house), [house]);
  const listingSummaryId = useId();
  const emailActionId = useId();
  const emailHelpId = useId();

  const listingSummaryText = useMemo(
    () =>
      `Address: ${house.address}. Homeowner: ${house.homeowner}. Price: ${formatPriceUSD(house.price)}.`,
    [house.address, house.homeowner, house.price],
  );

  return (
    <article
      aria-labelledby={listingSummaryId}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-md transition-colors duration-300 ease-out hover:bg-[var(--bg-purple-light)] ${className}`.trim()}
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
      <div className="relative w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 aspect-square">
        <a
          href={mailtoHref}
          aria-labelledby={`${emailActionId} ${listingSummaryId}`}
          aria-describedby={emailHelpId}
          className="absolute right-2 top-2 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm ring-1 ring-slate-200/80 transition-[opacity,color] duration-200 ease-out hover:text-[var(--color-purple)] focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-purple)] md:pointer-events-none md:opacity-0 md:group-focus-within:pointer-events-auto md:group-focus-within:opacity-100 md:group-hover:pointer-events-auto md:group-hover:opacity-100"
        >
          <MailIcon className="size-5" />
        </a>
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
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1.5 pt-4">
        <h2 className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
          {house.address}
        </h2>
        <p className="line-clamp-1 text-sm text-gray-600 sm:text-base">
          {house.homeowner}
        </p>
        <p className="text-xl font-bold tabular-nums sm:text-2xl">
          {formatPriceUSD(house.price)}
        </p>
      </div>
    </article>
  );
}

export const HouseCard = memo(HouseCardInner);
