# 05: V8 Exhibit: the parts and the four strokes

**What to build:** The V8 Exhibit renders a schematic engine from primitives: a boxed V block, transparent cylinder tubes, piston discs, connecting rods, a crankshaft of offset cylinders, and valve discs, colored with the shared palette. Steps one through five each animate one change with a real caption and a defined camera pose: meet the parts (each part lights up as it is named), intake (intake valve opens, piston drops, blue mixture fills the cylinder), compression (valves close, piston rises, mixture turns paler), power (spark, orange flash, piston shoved down, caption says this is the only stroke that makes power), and exhaust (exhaust valve opens, grey gas leaves as the piston rises). The manifest carries real sources.

**Blocked by:** 03 Open an Exhibit and page through its Walkthrough

**Status:** ready-for-agent

- [ ] The engine is recognisable as a V8 with eight cylinders in a V, pistons, rods, crankshaft, and valves
- [ ] Each of Steps one to five animates exactly one change over a short fixed duration
- [ ] Each Step has its own camera pose
- [ ] Captions are at most two plain sentences and define any technical word on first use
- [ ] Colors follow the shared palette: blue mixture, orange combustion, grey exhaust, yellow for the part moving now
- [ ] The manifest lists at least one general and one deeper source on four-stroke engines
- [ ] The Exhibit imports nothing from the Hall, the App, or other Exhibits
- [ ] Paging back and forth between Steps never leaves the model in a broken pose
