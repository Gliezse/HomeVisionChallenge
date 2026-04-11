import { memo, useState } from "react";
import type { House } from "../../types/house";
import { formatPriceUSD } from "../../utils/format";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240" viewBox="0 0 320 240"><rect fill="#e2e8f0" width="320" height="240"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#64748b" font-family="system-ui,sans-serif" font-size="14">No photo</text></svg>`
  );

export type HouseCardProps = {
  house: House;
};

function HouseCardInner({ house }: HouseCardProps) {
  const [src, setSrc] = useState(house.photoURL);

  return (
    <article className="flex gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-slate-100">
      <div className="h-24 w-36 shrink-0 overflow-hidden rounded-xl bg-slate-100">
        <img
          src={src}
          alt=""
          loading="lazy"
          width={144}
          height={96}
          className="h-full w-full object-cover"
          onError={() => setSrc(PLACEHOLDER_IMAGE)}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1">
        <h2 className="text-base font-semibold text-slate-900 leading-snug">
          {house.address}
        </h2>
        <p className="text-sm text-gray-600">{house.homeowner}</p>
        <p className="text-sm font-medium text-slate-800">
          {formatPriceUSD(house.price)}
        </p>
      </div>
    </article>
  );
}

export const HouseCard = memo(HouseCardInner);
