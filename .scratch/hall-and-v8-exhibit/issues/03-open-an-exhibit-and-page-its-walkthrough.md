# 03: Open an Exhibit and page through its Walkthrough

**What to build:** Clicking or pressing E on a highlighted pedestal opens the Exhibit as a full-screen overlay while the Hall pauses behind it. The Walkthrough starts on its first Step and shows one caption at a time. Next and Previous buttons, left and right arrow keys, and a row of clickable dots move between Steps. The last Step shows the Learn More sources, and a Free Play button appears there only when the Exhibit offers it. Close or Escape returns the Visitor to the Hall at the exact camera pose they left. This ticket builds the pure Walkthrough controller with its tests and the Walkthrough view that drives the Exhibit's mount handle. The stub V8 gets a few placeholder Steps to prove the path.

**Blocked by:** 02 Pedestals appear from the Exhibit registry

**Status:** ready-for-agent

- [ ] Controller starts on the first Step; next and previous move by one
- [ ] Previous on the first Step is a no-op and the button is disabled
- [ ] Next on the last Step is a no-op when Free Play is absent
- [ ] Next on the last Step enters Free Play when present; leaving Free Play returns to the last Step
- [ ] Jump to an out-of-range Step is rejected; jump while in Free Play returns to the walkthrough phase
- [ ] Controller tests cover every case above and use the V8 Step list as a fixture
- [ ] Opening an Exhibit mounts it into a container it owns and pauses the Hall render loop and pointer lock
- [ ] Caption, dots, Next, Previous, Free Play, Close, and Learn More render from controller state
- [ ] Arrow keys page Steps; Escape closes
- [ ] The Exhibit's mount handle is told each Step change and each Free Play enter or leave
- [ ] Closing unmounts the Exhibit and restores the Hall camera pose and pointer lock flow
- [ ] Nothing autoplays
