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
  hall.controls.onLockChange((locked) => (locked ? startScreen.hide() : startScreen.show()));
  hall.controls.onLockRefused(() => startScreen.askToClickAgain());
  hall.start();
}
