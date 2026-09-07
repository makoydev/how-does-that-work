# 01: Walk an empty Hall

**What to build:** Running the dev server opens a start screen that explains the controls. Clicking it locks the mouse and drops the Visitor into a bright, museum-white Hall with soft lighting and no textures. WASD walks in the camera's horizontal plane, the mouse looks around, walls stop the Visitor at the room bounds, and Escape releases the mouse and shows the start screen again. On a touch device the app shows a friendly "open this on a computer" message instead. This ticket also lays the project foundation: Vite with TypeScript and plain Three.js, pnpm, Vitest, lint, and the dev, build, preview, test, and lint scripts.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] `pnpm dev` serves the app and `pnpm build` produces a static bundle that works from `pnpm preview`
- [x] `pnpm test` and `pnpm lint` run and pass on an empty project
- [x] Start screen lists the controls and locks the mouse on click
- [x] WASD moves the camera at eye height; the mouse rotates the view
- [x] The Visitor cannot walk through the Hall's walls
- [x] Escape releases the mouse and shows the start screen without reloading
- [x] The Hall is bright and flat-colored with a visible floor, walls, and soft lighting
- [x] Touch devices see a plain message and never the 3D Hall

## Comments

**2026-09-07, agent:** Implemented. Test seam is `moveVisitor` (camera-relative WASD walking and wall clamping) in `src/hall/moveVisitor.test.ts`. Pointer lock, Escape, and mouse look were checked by reading the code and rendering in Chrome; the automation harness runs in a hidden window where browsers refuse pointer lock, so the lock-and-walk flow still wants one manual pass.

**2026-09-07, agent, after /code-review:** Renamed the "room" vocabulary the glossary avoids (now `buildWalls`, `HallSize`, `HallBounds`), removed unrequested arrow-key walking, and added a "please click again" hint on the start screen for the browser's post-Escape pointer-lock cooldown. The hint path was verified in Chrome, where the harness's hidden window refuses lock. Still open for a human: one manual pass of click-to-lock, walk, and Escape.
