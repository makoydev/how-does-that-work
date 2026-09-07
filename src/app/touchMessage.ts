export function showTouchMessage(container: HTMLElement): void {
  const message = document.createElement('div');
  message.className = 'touch-message';
  message.innerHTML =
    '<p><strong>How Does That Work</strong> is a walkable 3D library that needs a keyboard and a mouse.<br />Please open this on a computer.</p>';
  container.replaceChildren(message);
}
