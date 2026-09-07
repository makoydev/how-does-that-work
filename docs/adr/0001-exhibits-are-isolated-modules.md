---
status: accepted
---

# Exhibits are isolated, auto-discovered modules

The Hall is a launcher, not the place where learning happens. Each Exhibit lives in its own folder under `src/exhibits/<slug>/`, is discovered by scanning that folder at build time, and opens as a full-screen overlay over the paused Hall. Exhibit code may not import from the Hall or from other Exhibits. We chose this over animating subjects inside the shared 3D world because the owner adds Exhibits by prompting an agent, and an agent-written Exhibit must be unable to break the Hall or any existing Exhibit.

## Considered options

- **Learning inside the Hall**: walk up to the engine and watch it run in place. Prettier, but every new Exhibit becomes an edit to shared world code.
- **Separate websites per subject**: clicking navigates away. Loses the "one place" feeling and shares nothing.

## Consequences

- Adding an Exhibit is creating one folder and nothing else. No registry to edit.
- An Exhibit receives a plain DOM container and owns everything inside it, so it may be 2D or 3D and creates its own canvas if it needs one.
- The Hall's only knowledge of an Exhibit is its manifest (title, category, summary, sources) and an optional mini model for its pedestal.
