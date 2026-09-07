# 01: Walk an empty Hall

**What to build:** Running the dev server opens a start screen that explains the controls. Clicking it locks the mouse and drops the Visitor into a bright, museum-white Hall with soft lighting and no textures. WASD walks in the camera's horizontal plane, the mouse looks around, walls stop the Visitor at the room bounds, and Escape releases the mouse and shows the start screen again. On a touch device the app shows a friendly "open this on a computer" message instead. This ticket also lays the project foundation: Vite with TypeScript and plain Three.js, pnpm, Vitest, lint, and the dev, build, preview, test, and lint scripts.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `pnpm dev` serves the app and `pnpm build` produces a static bundle that works from `pnpm preview`
- [ ] `pnpm test` and `pnpm lint` run and pass on an empty project
- [ ] Start screen lists the controls and locks the mouse on click
- [ ] WASD moves the camera at eye height; the mouse rotates the view
- [ ] The Visitor cannot walk through the Hall's walls
- [ ] Escape releases the mouse and shows the start screen without reloading
- [ ] The Hall is bright and flat-colored with a visible floor, walls, and soft lighting
- [ ] Touch devices see a plain message and never the 3D Hall
