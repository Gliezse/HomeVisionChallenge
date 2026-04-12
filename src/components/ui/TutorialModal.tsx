import { useEffect, useId, useRef, type RefObject } from 'react';
import { Button } from './Button';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getVisibleFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
  ).filter((el) => {
    if (el.getAttribute('tabindex') === '-1') return false;
    const style = window.getComputedStyle(el);
    return style.visibility !== 'hidden' && style.display !== 'none';
  });
}

export type TutorialModalProps = {
  open: boolean;
  onClose: () => void;
  /** Element to restore focus when the modal closes (e.g. the open button). */
  triggerRef: RefObject<HTMLButtonElement | null>;
};

export function TutorialModal({
  open,
  onClose,
  triggerRef,
}: TutorialModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const triggerEl = triggerRef.current;
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const root = dialogRef.current;
      if (!root) return;

      const focusable = getVisibleFocusables(root);
      if (focusable.length === 0) return;

      const active = document.activeElement;
      if (active && !root.contains(active)) {
        e.preventDefault();
        focusable[0]?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (focusable.length === 1) {
        e.preventDefault();
        first.focus();
        return;
      }

      if (e.shiftKey) {
        if (active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      triggerEl?.focus();
    };
  }, [open, onClose, triggerRef]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-page-ink/40 backdrop-blur-[2px]"
        aria-hidden
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-xl ring-1 ring-slate-200"
      >
        <h2 id={titleId} className="text-lg font-semibold text-page-ink">
          How it works
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-gray-600">
          <p>
            <span className="font-medium text-page-ink">Favourites</span> — On
            each listing, use the heart on the photo. On larger screens, hover
            the card to reveal the actions. Your favourites are saved in this
            browser only.
          </p>
          <p>
            <span className="font-medium text-page-ink">Email</span> — Use the
            mail icon on a listing to open your email app with a pre-filled
            draft about that home (address, price, and details included).
          </p>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            ref={closeRef}
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
