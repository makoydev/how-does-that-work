import { hashForSlug, slugFromHash } from './hashRoute';

export interface HashRouter {
  /** The slug in the address bar right now, or nothing when it names the Hall. */
  readonly slug: string | null;
  /** Put an Exhibit in the address bar. Pushes a history entry so back returns to the Hall. */
  showExhibit(slug: string): void;
  /** Take the Exhibit out of the address bar. Pushes a history entry so back reopens it. */
  showHall(): void;
  /**
   * Subscribe to the address bar changing, whether by `showExhibit`,
   * `showHall`, or the browser's back and forward. Returns an unsubscribe.
   */
  onChange(listener: (slug: string | null) => void): () => void;
  dispose(): void;
}

/**
 * The thin adapter between the pure hash shape and the browser's address
 * bar and history. The App treats the address bar as the one source of
 * truth for what is on screen, so every change flows through `onChange`.
 */
export function createHashRouter(): HashRouter {
  const listeners = new Set<(slug: string | null) => void>();
  const read = () => slugFromHash(window.location.hash);
  const notify = () => {
    const slug = read();
    for (const listener of listeners) listener(slug);
  };

  const navigate = (slug: string | null) => {
    if (read() === slug) return;
    // pushState rather than assigning location.hash: clearing leaves no stray
    // "#" behind, and listeners hear about it synchronously, inside the
    // Visitor's click, which matters for recapturing the mouse afterwards.
    const url = slug ? hashForSlug(slug) : window.location.pathname + window.location.search;
    window.history.pushState(null, '', url);
    notify();
  };

  window.addEventListener('hashchange', notify);

  return {
    get slug() {
      return read();
    },
    showExhibit: (slug) => navigate(slug),
    showHall: () => navigate(null),
    onChange: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    dispose: () => {
      window.removeEventListener('hashchange', notify);
      listeners.clear();
    },
  };
}
