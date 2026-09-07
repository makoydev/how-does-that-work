# 04: Direct links by hash

**What to build:** Every Exhibit has a hash URL of the form `#/<slug>`. Opening that URL shows the Walkthrough immediately with the Hall created behind it, so closing drops the Visitor at the Hall's default spawn point. An unknown or empty hash shows the Hall. Opening an Exhibit from the Hall sets the hash, and closing clears it, so the address bar always reflects what is on screen.

**Blocked by:** 03 Open an Exhibit and page through its Walkthrough

**Status:** ready-for-agent

- [x] Loading the app with a valid slug hash opens that Exhibit without showing the Hall first
- [x] Closing an Exhibit opened by URL lands in the Hall at the default spawn point
- [x] An unknown slug or an empty hash shows the Hall with no error
- [x] Opening from the Hall sets the hash; closing clears it
- [x] Browser back and forward between the Hall and an Exhibit behave sensibly

## Comments

**2026-09-07, agent:** Implemented. Test seam is the pure hash shape (`src/app/hashRoute.test.ts`, eight cases: an Exhibit hash yields its slug; an empty hash, a bare hash sign, a slash with nothing after it, a hash that skips the slash, and a hash with more than one segment all yield nothing; a slug formats as `#/<slug>` and round-trips). The registry still decides whether a slug is known. A thin router (`src/app/hashRouter.ts`) wraps the address bar and history: it pushes a history entry on open and on close, so back reopens the Exhibit and forward closes it again, and it uses `pushState` rather than assigning `location.hash` so closing leaves no stray `#` behind and listeners hear about it synchronously, inside the Visitor's click. The App (`src/main.ts`) treats the address bar as the one source of truth: opening from the Hall and the Close button and Escape only change the hash, and a single listener shows whatever the hash names, so a direct link, a hand-edited URL, and back and forward all take the same path. On a direct link the Hall is created but never started until close, so closing lands at the default spawn point; the start screen is hidden while an Exhibit is open so it no longer bleeds through the overlay. The overlay's Close button and Escape now call a `requestClose` callback instead of tearing the overlay down themselves. Checked in Chrome against the dev server: loading `#/v8-engine` shows the Walkthrough with no Hall first; Close clears the URL to the bare path and lands in the Hall; back reopens the Exhibit and forward returns to the Hall; editing the hash to an unknown slug shows the Hall, editing it to a known one opens the Exhibit, and Escape closes; a fresh load of `#/stale-link` shows the Hall with no console error. Still open for a human: opening from the Hall by pressing E, since the harness's hidden window refuses pointer lock; the code path is the same `router.showExhibit` the URL checks exercised.
