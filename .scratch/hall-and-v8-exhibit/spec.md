# Spec: The Hall and the V8 Engine Exhibit

Status: ready-for-agent
Category: foundation

## Problem Statement

The owner wants to learn how a lot of things work, the way a curious kid would: by clicking on something and watching its parts move step by step. Static articles and videos don't give that. There is also no single place to collect these lessons, so each new curiosity would otherwise become a scattered one-off page. The owner wants one place they can return to, and they want adding a new lesson to be as simple as asking an agent for it.

## Solution

How Does That Work is a walkable 3D library. The Visitor walks a Hall in first person with WASD and mouse look. Every object on a pedestal is an Exhibit that teaches exactly one subject. Clicking an Exhibit opens its Walkthrough as an overlay over the paused Hall: a sequence of Steps, each one animated change to a schematic model plus a short plain-language caption, followed by optional Free Play with controls to experiment. Every Exhibit ends with sources for going deeper.

This spec delivers the Hall, the Exhibit contract, and the first Exhibit, the V8 engine, plus the authoring guide that makes "add an Exhibit about X" a complete prompt for future additions.

## User Stories

### Entering the Hall

1. As a Visitor, I want to open the app and see a start screen with the controls explained, so that I know how to move before the mouse is captured.
2. As a Visitor, I want to click the start screen to lock the mouse and enter the Hall, so that I can look around naturally.
3. As a Visitor, I want to walk with W, A, S, and D, so that I can approach any Exhibit.
4. As a Visitor, I want to look around with the mouse, so that I can find Exhibits from anywhere in the Hall.
5. As a Visitor, I want to be stopped by walls, so that I can't walk out of the Hall.
6. As a Visitor, I want to press Escape to release the mouse and see the start screen again, so that I can leave without closing the tab.
7. As a Visitor, I want the Hall to be clean, bright, and museum-like, so that the space feels calm and deliberate.
8. As a Visitor on a phone or tablet, I want a friendly message saying to open the app on a computer, so that I'm not stuck on a broken screen.

### Finding Exhibits

9. As a Visitor, I want every Exhibit on its own pedestal in a grid, so that I can see at a glance how many there are.
10. As a Visitor, I want pedestals ordered by Category and then by title, so that related Exhibits sit together.
11. As a Visitor, I want each pedestal to show a floating title and Category, so that I know what an Exhibit is before opening it.
12. As a Visitor, I want a pedestal to show a mini model when the Exhibit provides one, so that I can recognise the subject from across the room.
13. As a Visitor, I want an Exhibit to highlight when I look at it from within reach, so that I know it can be opened.
14. As a Visitor, I want to click or press E on a highlighted Exhibit to open it, so that I can start learning.
15. As a Visitor, I want the Hall to grow its grid automatically when Exhibits are added, so that nothing has to be rearranged by hand.

### Going through a Walkthrough

16. As a Visitor, I want the Exhibit to open as a full-screen overlay with the Hall paused behind it, so that I don't lose my place.
17. As a Visitor, I want the Walkthrough to start on its first Step, so that I always begin at the beginning.
18. As a Visitor, I want each Step to animate exactly one change and show one caption, so that I can follow one idea at a time.
19. As a Visitor, I want captions of at most two short plain sentences, so that I never have to reread.
20. As a Visitor, I want any technical word defined in the caption where it first appears, so that I never need a separate glossary.
21. As a Visitor, I want Next and Previous buttons, so that I can page at my own pace.
22. As a Visitor, I want the left and right arrow keys to do the same, so that I don't have to reach for the mouse.
23. As a Visitor, I want a row of dots showing which Step I'm on, so that I know how far along I am.
24. As a Visitor, I want to click a dot to jump to that Step, so that I can revisit a stage.
25. As a Visitor, I want the Walkthrough never to autoplay, so that I stay in control.
26. As a Visitor, I want the Previous button disabled on the first Step, so that the interface doesn't lie about what it can do.
27. As a Visitor, I want moving parts, air, hot gas, and waste to use the same colors in every Exhibit, so that I learn the color code once.
28. As a Visitor, I want the last Step to show a Learn More list of sources, so that I have somewhere to go for depth.
29. As a Visitor, I want to press Escape or click a Close button to return to the Hall exactly where I was standing, so that closing is never a punishment.

### Free Play

30. As a Visitor, I want a Free Play button to appear after the last Step when the Exhibit offers it, so that I can experiment after understanding.
31. As a Visitor, I want Free Play controls to be labelled plainly, so that I know what each one does before touching it.
32. As a Visitor, I want to leave Free Play back to the Walkthrough, so that I can re-read a Step after playing.
33. As a Visitor, I want Exhibits without Free Play to end cleanly on the sources Step with no dead button, so that the interface stays honest.

### Direct links

34. As a Visitor, I want each Exhibit to have a hash URL, so that I can open a lesson directly.
35. As a Visitor, I want opening an Exhibit URL to skip the Hall and show the Walkthrough immediately, so that a link goes straight to the lesson.
36. As a Visitor, I want closing an Exhibit opened by URL to drop me into the Hall, so that I can browse from there.
37. As a Visitor, I want a wrong hash to land me in the Hall rather than a blank page, so that a stale link is harmless.

### The V8 Engine Exhibit

38. As a Visitor, I want a "meet the parts" Step where the block, eight cylinders in a V, pistons, connecting rods, and crankshaft light up as they're named, so that I know the cast before the story.
39. As a Visitor, I want an intake Step where one cylinder's intake valve opens, the piston drops, and blue mixture fills the cylinder, so that I see how fuel and air get in.
40. As a Visitor, I want a compression Step where the valves close and the piston rises while the mixture turns paler, so that I see it being squeezed.
41. As a Visitor, I want a power Step where a spark flashes the mixture orange and the piston is shoved down, with the caption saying this is the only stroke that makes power, so that I understand where the force comes from.
42. As a Visitor, I want an exhaust Step where the exhaust valve opens and grey burnt gas leaves as the piston rises, so that I see the cycle complete.
43. As a Visitor, I want a crankshaft Step where the camera moves to show the connecting rod turning up-and-down into round-and-round, so that I understand how pistons spin a shaft.
44. As a Visitor, I want a final Step where all eight cylinders run with the firing order highlighted, so that I see why the crank spins smoothly.
45. As a Visitor, I want an RPM slider in Free Play, so that I can watch the engine at any speed.
46. As a Visitor, I want a cutaway toggle in Free Play, so that I can see inside or see the whole block.
47. As a Visitor, I want a "follow one cylinder" button in Free Play that slows the engine and tracks a single piston, so that I can study one cycle in context.
48. As a Visitor, I want the V8 pedestal to show a mini engine, so that the first Exhibit demonstrates the mini-model feature.

### Adding Exhibits

49. As the owner, I want to add an Exhibit by creating exactly one folder, so that nothing else needs editing.
50. As the owner, I want the Hall to discover Exhibits automatically at build time, so that there is no registry to maintain.
51. As the owner, I want an Exhibit's manifest to require a title, Category, one-line summary, and at least one source, so that an incomplete Exhibit fails loudly.
52. As the owner, I want Exhibit code to be unable to import from the Hall or other Exhibits, so that an agent-written Exhibit cannot break anything else.
53. As the owner, I want an authoring guide describing the folder layout, manifest, Walkthrough contract, color code, caption rules, and sources requirement, so that "add an Exhibit about X" is a complete prompt.
54. As the owner, I want the project config file to point at the authoring guide, so that an agent finds it without being told.
55. As the owner, I want an Exhibit to be free to render in 2D or 3D, so that each subject can use whatever teaches best.
56. As the owner, I want models built from primitives in a schematic style by default, so that no Exhibit depends on assets I have to source.
57. As the owner, I want to be able to hand an Exhibit a real model file when I have one, so that the default is a default and not a limit.

### Project foundation

58. As the owner, I want the project in a git repository with a first commit, so that review and deploy tooling works.
59. As the owner, I want a single command to start a dev server, so that opening the library is one step.
60. As the owner, I want a single command to produce a static build, so that publishing to GitHub Pages later is a one-time step.
61. As the owner, I want a single command to run the tests, so that I can check an agent's work.

## Implementation Decisions

### Stack

- Vite with TypeScript and plain Three.js. No React. pnpm as the package manager. Vitest for tests.
- Static site with hash routing. No server, no build-time data fetching.
- Desktop only. Touch devices are detected on load and shown a message instead of the app.

### Module layout

- **App**: reads the hash on load, chooses between showing the Hall or opening an Exhibit directly, and owns the overlay that hosts an open Exhibit. Pauses the Hall's render loop and releases pointer lock while an Exhibit is open.
- **Hall**: builds the room, pedestals, lighting, first-person controls, wall collision, and the look-at highlighting and open interaction. Reads only the Exhibit registry.
- **Exhibit registry**: a pure module. Takes the set of discovered Exhibit modules as input, validates each manifest, sorts by Category then title, and resolves a slug to an Exhibit. The build-time folder scan is a thin adapter that feeds it, kept separate so the registry is testable without the bundler.
- **Walkthrough controller**: a pure state module. Constructed with a Step count and a flag for whether Free Play exists. Exposes next, previous, jump to Step, enter Free Play, and leave Free Play. Reports the current Step index and the current phase, which is either "walkthrough" or "free play". Next on the last Step is a no-op unless Free Play exists, in which case it enters Free Play. Previous on the first Step is a no-op.
- **Walkthrough view**: renders the caption panel, Next, Previous, dots, Free Play button, Close button, and the Learn More list, driven entirely by the controller. Wires arrow keys and Escape.
- **Shared palette**: one module exporting the color code: fresh air blue, hot or burning orange, waste grey, active moving part yellow, and a neutral for everything else. Exhibits import this and nothing else shared.
- **Exhibits**: one folder per Exhibit under a single exhibits directory. This is the only place agent-written code lands.

### Exhibit contract

An Exhibit folder exports one object with:

- A **manifest**: slug, title, Category, one-line summary, and a non-empty list of sources, each a label and a URL.
- A **Walkthrough definition**: an ordered list of Steps, each with a caption and an identifier. Whether the Exhibit offers Free Play.
- A **mount** function that receives a plain DOM container and a handle for reacting to the controller: it is told when the Step changes and when Free Play is entered or left, and returns an unmount function. The Exhibit creates its own canvas inside the container if it needs one and owns its own render loop.
- An optional **mini model** function returning a small Three.js object for the pedestal. When absent, the pedestal shows a placard only.

Exhibits never import from the Hall, the App, or other Exhibits. This is enforced by a lint rule restricting imports from the exhibits directory to Three.js, the shared palette, and the Exhibit contract types. See ADR 0001.

### Hall behaviour

- First-person camera at eye height. Pointer lock on click of the start screen. WASD movement in the camera's horizontal plane. Axis-aligned wall collision against the room bounds.
- Pedestals laid out on a grid whose size is computed from the Exhibit count, ordered by Category then title, left to right, front to back. The room grows to fit the grid with a fixed margin.
- Each pedestal carries the Exhibit's title and Category as a floating label. If the Exhibit provides a mini model, it sits on the pedestal above the label.
- A raycast from the camera each frame finds the pedestal being looked at. Within a reach distance it is highlighted and an "open" prompt is shown. Click or E opens it.
- Opening an Exhibit sets the hash to its slug. Closing clears the hash and restores the camera pose from before opening.

### Routing

- A hash of the form `#/<slug>` opens that Exhibit. An unknown slug or an empty hash shows the Hall. When an Exhibit is opened from a direct URL, the Hall is still created behind it so that closing lands in the Hall at its default spawn point.

### V8 Engine Exhibit

- Rendered in 3D from primitives: block as a boxed V, cylinders as transparent tubes, pistons as short cylinders, connecting rods as thin boxes, crankshaft as a chain of offset cylinders, valves as discs.
- Seven Steps as listed in the user stories. Step transitions animate over a short fixed duration. The camera has a defined pose per Step.
- Free Play: RPM slider driving the crank angle rate, cutaway toggle hiding the near half of the block, and follow-one-cylinder which slows the engine and locks the camera on cylinder one.
- Sources: at least one general reference and one deeper reference on four-stroke engines and V8 firing order.
- Provides a mini model: the block and crankshaft only, scaled to fit the pedestal.

### Authoring guide

- Lives in the docs directory, pointed to from the project config file under the existing Agent skills section.
- Covers: folder layout, manifest fields and validation rules, the Walkthrough and mount contract, the color code, caption rules, the sources requirement, the mini-model option, the 2D-or-3D choice, the no-imports rule, and a checklist to run before declaring an Exhibit done.

### Project foundation

- Run `git init` and make a first commit once the scaffold builds.
- Scripts: dev, build, preview, test, lint.

## Testing Decisions

A good test exercises a module through its public interface with inputs a caller would really give, asserts only on observable output, and never inspects internals or rendering. Nothing in this project tests pixels, Three.js scenes, or pointer lock.

Two seams are tested with Vitest:

- **Walkthrough controller**. Cases: starts on the first Step; next and previous move by one; previous on the first Step is a no-op; next on the last Step is a no-op when Free Play is absent; next on the last Step enters Free Play when present; leaving Free Play returns to the last Step; jump to a Step out of range is rejected; jump while in Free Play returns to the walkthrough phase. The V8 Exhibit's real Step list is used as one fixture so the first Exhibit is covered without a special test.
- **Exhibit registry**. Cases: a valid manifest is accepted; a missing title, Category, summary, or empty sources list is rejected with a message naming the slug and the field; duplicate slugs are rejected; ordering is by Category then title; slug resolution returns the Exhibit or nothing for an unknown slug; an empty hash resolves to nothing.

There is no prior art in the repo. These are the first tests, and they set the pattern: pure modules, plain inputs, no mocks.

## Out of Scope

- Themed wings or doors. Category is stored but the Hall does not group by it yet.
- Progress tracking or remembering visited Exhibits.
- Sound of any kind.
- Touch or mobile support beyond the "open on a computer" message.
- Autoplay or timed Walkthroughs.
- Deploying to GitHub Pages. The static build is ready for it, but no workflow is added.
- Real model loading. The contract allows it, but no loader or example ships now.
- Any Exhibit other than the V8 engine.
- Camshaft, spark plug wiring, and cooling in the V8 model.
- A standalone glossary or term hover in captions.

## Further Notes

- Vocabulary comes from the glossary in the repo root and should be used exactly in code, captions, and docs: Hall, Exhibit, Walkthrough, Step, Free Play, Category, Visitor.
- ADR 0001 records why Exhibits are isolated modules. The lint rule is the enforcement; the authoring guide is the explanation.
- The color code is deliberately tiny so a kid learns it once. Resist adding colors per Exhibit; add to the shared palette only when a concept recurs across Exhibits.
- The Walkthrough controller is the seam future Exhibits get for free. Any new per-Exhibit interactivity should be expressed as Free Play controls, not as new controller states, unless it recurs across Exhibits.
