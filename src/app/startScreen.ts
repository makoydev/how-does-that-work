export interface StartScreen {
  show(): void;
  hide(): void;
  /** Tell the Visitor the click did not take and to try again. */
  askToClickAgain(): void;
}

/**
 * The overlay the Visitor sees before the mouse is captured. It explains the
 * controls and hands a click to `onStart`, which is expected to lock the mouse.
 */
export function createStartScreen(container: HTMLElement, onStart: () => void): StartScreen {
  const screen = document.createElement('div');
  screen.className = 'start-screen';
  screen.innerHTML = `
    <div class="start-screen__card">
      <h1>How Does That Work</h1>
      <p>A walkable library where every object shows how something works.</p>
      <dl class="start-screen__controls">
        <dt><kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd></dt><dd>Walk</dd>
        <dt>Mouse</dt><dd>Look around</dd>
        <dt><kbd>Esc</kbd></dt><dd>Release the mouse and come back here</dd>
      </dl>
      <p class="start-screen__cta">Click anywhere to enter the Hall</p>
      <p class="start-screen__retry" hidden>The mouse was not captured yet. Please click again.</p>
    </div>
  `;
  screen.addEventListener('click', onStart);
  container.appendChild(screen);
  const retry = screen.querySelector<HTMLElement>('.start-screen__retry');
  if (!retry) throw new Error('Start screen is missing its retry hint');

  return {
    show: () => {
      retry.hidden = true;
      screen.hidden = false;
    },
    hide: () => {
      screen.hidden = true;
    },
    askToClickAgain: () => {
      retry.hidden = false;
    },
  };
}
