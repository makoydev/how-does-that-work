# 02: Pedestals appear from the Exhibit registry

**What to build:** The Hall shows one pedestal per Exhibit, each with a floating title and Category, laid out in a grid ordered by Category then title that grows to fit the number of Exhibits. Looking at a pedestal from within reach highlights it and shows an "open" prompt. This ticket defines the Exhibit contract (manifest, Walkthrough definition, mount, optional mini model), the shared color palette, the pure Exhibit registry with its tests, the build-time discovery adapter that scans the exhibits directory, and the lint rule that stops Exhibit code importing from the Hall, the App, or other Exhibits (see ADR 0001). A stub V8 Exhibit with a manifest and a trivial mount proves the path.

**Blocked by:** 01 Walk an empty Hall

**Status:** ready-for-agent

- [x] An Exhibit is one folder under the exhibits directory and nothing else needs editing to add it
- [x] The registry rejects a manifest missing a title, Category, summary, or with an empty sources list, naming the slug and field
- [x] The registry rejects duplicate slugs
- [x] The registry orders Exhibits by Category then title
- [x] The registry resolves a slug to an Exhibit and returns nothing for an unknown or empty slug
- [x] Registry tests cover every case above with plain inputs and no mocks
- [x] The lint rule fails the build if an Exhibit imports from outside Three.js, the shared palette, or the contract types
- [x] The shared palette exports fresh-air blue, hot orange, waste grey, active-part yellow, and a neutral
- [x] The Hall shows a pedestal with title and Category for the stub V8 Exhibit
- [x] Pedestal count and grid size follow the number of discovered Exhibits
- [x] Looking at a pedestal within reach highlights it and shows an open prompt; looking away clears both

## Comments

**2026-09-07, agent:** Implemented. Test seams are the Exhibit registry (`src/registry/exhibitRegistry.test.ts`, eleven cases: valid manifest, each missing field naming slug and field, duplicate slugs, Category-then-title order, slug resolution for known, unknown, and empty) and the pure pedestal grid (`src/hall/layoutPedestals.test.ts`). Discovery is `import.meta.glob` over `src/exhibits/*/index.ts` in `src/registry/discoverExhibits.ts`, which also insists the folder name equals the manifest slug. The isolation rule is a custom ESLint plugin in `lint/exhibitIsolation.js`, scoped to `src/exhibits/**`; it was checked by linting a throwaway Exhibit that imported the Hall, a sibling Exhibit, the registry, and a dynamic App import (four errors) alongside the palette, contract, and Three.js (allowed). `pnpm build` now runs lint so a bad Exhibit fails the build. The pedestal, title, and Category were confirmed rendering in Chrome; the look-at highlight and open prompt need pointer lock, which the automation harness's hidden window refuses, so that path was checked by reading the code and wants one manual pass. The prompt says "Click or press E to open"; opening itself is ticket 03.

**2026-09-07, agent, after /code-review:** Applied the review. The registry now also rejects a source with an empty label or URL (two more tests). The isolation lint rule matches every file under `src/exhibits/`, not just `*.ts`, so a `.js` helper cannot slip a Hall import past it. The stub V8 carries one placeholder Step and no Free Play, since ticket 03 owns the Step list. The look-at raycast and open prompt moved out of `Hall.ts` into `src/hall/pedestalFocus.ts`; the layout returns a `hall` size instead of two loose numbers; the palette exports only its five colours; a "stage" doc comment and a "world" constant name were reworded to match the glossary. Kept on purpose: the folder-equals-slug check in `discoverExhibits.ts` (small, and the hash route in ticket 04 depends on it) and the Hall holding the whole Exhibit rather than only its manifest (ticket 03 opens it from the focused pedestal). Still open for a human: one manual pass of walking up to the pedestal to see the highlight and prompt appear and clear.
