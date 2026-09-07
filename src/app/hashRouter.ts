import { hashForSlug, slugFromHash } from './exhibitHash';

export interface HashRouter {
  /** The slug in the address bar right now, or nothing when it names the Hall. */
  readonly slug: string | null;
  /** Put an Exhibit in the address bar. Pushes a history entry so back returns to the Hall. */
  showExhibit(slug: string): void;
  /** Take the Exhibit out of the address bar. Pushes a history entry so back reopens it. */
  showHall(): void;
  /**
   * Correct a hash that names nothing to the Hall's address, without adding
   * a history entry, so back still leaves the way the Visitor came.
   */
  replaceWithHall(): void;
  /**
   * Subscribe to the address bar changing, whether by `showExhibit`,
   * `showHall`, or the browser's back and forward. Returns an unsubscribe.
   */
  onChange(listener: (slug: string | null) => void): () => void;
  /** Stop listening to the address bar. */
  dispose(): void;
}

/**
 * The thin adapter between the pure hash shape and the browser's address
 * bar and history. The App treats the address bar as the one source of
 * truth for what is on screen, so every change flows through `onChange`.
 */
export function createHashRouter(): HashRouter {
  const listeners = new Set<(slug: string | null) => void>();
  const currentSlug = () => slugFromHash(window.location.hash);
  const notify = () => {
    const slug = currentSlug();
    for (const listener of listeners) listener(slug);
  };

  const hallUrl = () => window.location.pathname + window.location.search;

  const navigate = (slug: string | null) => {
    if (currentSlug() === slug) return;
    // pushState rather than assigning location.hash: clearing leaves no stray
    // "#" behind, and listeners hear about it synchronously rather than on a
    // later task.
    window.history.pushState(null, '', slug ? hashForSlug(slug) : hallUrl());
    notify();
  };

  window.addEventListener('hashchange', notify);

  return {
    get slug() {
      return currentSlug();
    },
    showExhibit: (slug) => navigate(slug),
    showHall: () => navigate(null),
    replaceWithHall: () => {
      if (window.location.hash === '') return;
      window.history.replaceState(null, '', hallUrl());
    },
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
