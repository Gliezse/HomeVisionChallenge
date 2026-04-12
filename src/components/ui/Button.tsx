import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

type Variant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primary:
    'bg-[var(--color-purple)] text-white hover:bg-[var(--color-purple)]/80 focus-visible:outline-[var(--color-purple)]',
  secondary:
    'bg-white text-page-ink shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus-visible:outline-slate-400',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      loading = false,
      disabled,
      className = '',
      children,
      ...rest
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type="button"
        className={`${base} ${variants[variant]} ${className}`.trim()}
        disabled={disabled ?? loading}
        aria-busy={loading}
        {...rest}
      >
        {loading ? (
          <span
            className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent cursor-pointer"
            aria-hidden
          />
        ) : null}
        {children}
      </button>
    );
  },
);
