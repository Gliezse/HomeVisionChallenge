import type { ReactNode } from 'react';

export type TooltipSide = 'left' | 'right' | 'top' | 'bottom';

const SIDE_CLASS: Record<TooltipSide, string> = {
  left: 'right-full top-1/2 mr-2 -translate-y-1/2',
  right: 'left-full top-1/2 ml-2 -translate-y-1/2',
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
};

const BUBBLE =
  'pointer-events-none absolute z-20 whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-md opacity-0 transition-opacity duration-150 ease-out group-hover/tooltip:opacity-100 group-has-[:focus-visible]/tooltip:opacity-100';

export type TooltipProps = {
  label: ReactNode;
  children: ReactNode;
  side?: TooltipSide;
  className?: string;
};

export function Tooltip({
  label,
  children,
  side = 'left',
  className = '',
}: TooltipProps) {
  return (
    <div className={`group/tooltip relative ${className}`.trim()}>
      <span aria-hidden className={`${BUBBLE} ${SIDE_CLASS[side]}`}>
        {label}
      </span>
      {children}
    </div>
  );
}
