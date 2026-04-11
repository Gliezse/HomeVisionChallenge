import type { ReactNode } from 'react';

type ErrorMessageProps = {
  title?: string;
  message: string;
  children?: ReactNode;
  className?: string;
};

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  children,
  className = '',
}: ErrorMessageProps) {
  return (
    <div
      className={`rounded-2xl border border-red-200 bg-red-50 p-4 text-red-900 shadow-sm ${className}`.trim()}
      role="alert"
    >
      <p className="text-sm font-semibold">{title}</p>
      <p className="mt-1 text-sm text-red-800/90">{message}</p>
      {children ? <div className="mt-3">{children}</div> : null}
    </div>
  );
}
