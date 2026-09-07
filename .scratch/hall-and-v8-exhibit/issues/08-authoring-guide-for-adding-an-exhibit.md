# 08: Authoring guide for adding an Exhibit

**What to build:** A guide in the docs directory that makes "add an Exhibit about X" a complete prompt for an agent. It explains the folder layout, every manifest field and its validation rule, the Walkthrough and mount contract, the shared color code, the caption rules, the sources requirement, the optional mini model, the 2D or 3D choice, the no-imports rule from ADR 0001, and a checklist to run before an Exhibit is declared done. The project config file points to it under the existing Agent skills section. The V8 Exhibit is referenced as the worked example.

**Blocked by:** 06 V8 Exhibit: crankshaft, all eight, and Free Play; 07 Mini models on pedestals

**Status:** ready-for-agent

- [ ] The guide covers every item listed above using the glossary vocabulary exactly
- [ ] Following the guide alone, a second trivial Exhibit can be added and appears in the Hall with no other edits
- [ ] The done checklist includes running lint and tests and checking captions and sources
- [ ] The project config file links to the guide
