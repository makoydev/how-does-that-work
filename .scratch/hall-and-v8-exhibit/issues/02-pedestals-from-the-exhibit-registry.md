# 02: Pedestals appear from the Exhibit registry

**What to build:** The Hall shows one pedestal per Exhibit, each with a floating title and Category, laid out in a grid ordered by Category then title that grows to fit the number of Exhibits. Looking at a pedestal from within reach highlights it and shows an "open" prompt. This ticket defines the Exhibit contract (manifest, Walkthrough definition, mount, optional mini model), the shared color palette, the pure Exhibit registry with its tests, the build-time discovery adapter that scans the exhibits directory, and the lint rule that stops Exhibit code importing from the Hall, the App, or other Exhibits (see ADR 0001). A stub V8 Exhibit with a manifest and a trivial mount proves the path.

**Blocked by:** 01 Walk an empty Hall

**Status:** ready-for-agent

- [ ] An Exhibit is one folder under the exhibits directory and nothing else needs editing to add it
- [ ] The registry rejects a manifest missing a title, Category, summary, or with an empty sources list, naming the slug and field
- [ ] The registry rejects duplicate slugs
- [ ] The registry orders Exhibits by Category then title
- [ ] The registry resolves a slug to an Exhibit and returns nothing for an unknown or empty slug
- [ ] Registry tests cover every case above with plain inputs and no mocks
- [ ] The lint rule fails the build if an Exhibit imports from outside Three.js, the shared palette, or the contract types
- [ ] The shared palette exports fresh-air blue, hot orange, waste grey, active-part yellow, and a neutral
- [ ] The Hall shows a pedestal with title and Category for the stub V8 Exhibit
- [ ] Pedestal count and grid size follow the number of discovered Exhibits
- [ ] Looking at a pedestal within reach highlights it and shows an open prompt; looking away clears both
