import { openExhibit, type OpenedExhibit } from './app/exhibitOverlay';
import { createHashRouter } from './app/hashRouter';
import { isTouchDevice } from './app/isTouchDevice';
import { createStartScreen } from './app/startScreen';
import { showTouchMessage } from './app/touchMessage';
import { createHall } from './hall/Hall';
import { discoverExhibits } from './registry/discoverExhibits';
import { createExhibitRegistry } from './registry/exhibitRegistry';
import type { Exhibit } from './shared/exhibitContract';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

if (isTouchDevice()) {
  showTouchMessage(app);
} else {
  const registry = createExhibitRegistry(discoverExhibits());
  const hall = createHall(app, registry);
  const startScreen = createStartScreen(app, () => hall.controls.lock());
  const router = createHashRouter();
  let openedExhibit: OpenedExhibit | null = null;

  hall.controls.onLockChange((locked) => {
    // Releasing the mouse for an open Exhibit is not a reason to show the start screen.
    if (openedExhibit) return;
    if (locked) startScreen.hide();
    else startScreen.show();
  });
  hall.controls.onLockRefused(() => startScreen.askToClickAgain());

  const showExhibit = (exhibit: Exhibit) => {
    if (openedExhibit?.exhibit === exhibit) return;
    openedExhibit?.close();
    openedExhibit = openExhibit(app, exhibit, () => router.showHall());
    startScreen.hide();
    // Pausing the loop and freeing the mouse leaves the camera exactly where
    // it is, so closing returns the Visitor to the same pose. When the Hall
    // was never started, that pose is the default spawn point. The overlay is
    // recorded first so the lock-change listener knows not to show the start screen.
    hall.stop();
    document.exitPointerLock();
  };

  const showHall = () => {
    if (openedExhibit) {
      openedExhibit.close();
      openedExhibit = null;
      startScreen.show();
      // Browsers may refuse to recapture the mouse without a fresh click; the
      // start screen is already up for that case.
      hall.controls.lock();
    }
    hall.start();
  };

  // The address bar is the one source of truth: opening from the Hall and
  // closing both go through it, so back and forward land on the same path.
  const showWhatTheAddressBarNames = () => {
    const exhibit = router.slug === null ? undefined : registry.resolve(router.slug);
    if (exhibit) showExhibit(exhibit);
    else showHall();
  };
  router.onChange(showWhatTheAddressBarNames);
  hall.onOpenRequest((exhibit) => router.showExhibit(exhibit.manifest.slug));

  showWhatTheAddressBarNames();
}
