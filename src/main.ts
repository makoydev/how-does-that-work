import { isTouchDevice } from './app/isTouchDevice';
import { createStartScreen } from './app/startScreen';
import { showTouchMessage } from './app/touchMessage';
import { createHall } from './hall/Hall';

const HALL_SIZE = { width: 20, depth: 20, height: 4 };

const app = document.getElementById('app');
if (!app) throw new Error('Missing #app container');

if (isTouchDevice()) {
  showTouchMessage(app);
} else {
  const hall = createHall(app, HALL_SIZE);
  const startScreen = createStartScreen(app, () => hall.controls.lock());
  hall.controls.onLockChange((locked) => (locked ? startScreen.hide() : startScreen.show()));
  hall.controls.onLockRefused(() => startScreen.askToClickAgain());
  hall.start();
}
