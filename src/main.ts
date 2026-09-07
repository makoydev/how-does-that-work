import { openExhibit, type OpenExhibit } from './app/exhibitOverlay';
import { isTouchDevice } from './app/isTouchDevice';
import { createStartScreen } from './app/startScreen';
import { showTouchMessage } from './app/touchMessage';
import { createHall } from './hall/Hall';
import { discoverExhibits } from './registry/discoverExhibits';
import { createExhibitRegistry } from './registry/exhibitRegistry';

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

if (isTouchDevice()) {
  showTouchMessage(app);
} else {
  const registry = createExhibitRegistry(discoverExhibits());
  const hall = createHall(app, registry);
  const startScreen = createStartScreen(app, () => hall.controls.lock());
  let open: OpenExhibit | null = null;

  hall.controls.onLockChange((locked) => {
    // Releasing the mouse for an open Exhibit is not a reason to show the start screen.
    if (open) return;
    if (locked) startScreen.hide();
    else startScreen.show();
  });
  hall.controls.onLockRefused(() => startScreen.askToClickAgain());

  hall.onOpenRequest((exhibit) => {
    if (open) return;
    // Pausing the loop and freeing the mouse leaves the camera exactly where
    // it is, so closing returns the Visitor to the same pose.
    hall.stop();
    document.exitPointerLock();
    open = openExhibit(app, exhibit, () => {
      open = null;
      hall.start();
      startScreen.show();
      // Browsers may refuse to recapture the mouse without a fresh click; the
      // start screen is already up for that case.
      hall.controls.lock();
    });
  });

  hall.start();
}
