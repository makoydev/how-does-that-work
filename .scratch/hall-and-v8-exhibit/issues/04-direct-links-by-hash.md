# 04: Direct links by hash

**What to build:** Every Exhibit has a hash URL of the form `#/<slug>`. Opening that URL shows the Walkthrough immediately with the Hall created behind it, so closing drops the Visitor at the Hall's default spawn point. An unknown or empty hash shows the Hall. Opening an Exhibit from the Hall sets the hash, and closing clears it, so the address bar always reflects what is on screen.

**Blocked by:** 03 Open an Exhibit and page through its Walkthrough

**Status:** ready-for-agent

- [ ] Loading the app with a valid slug hash opens that Exhibit without showing the Hall first
- [ ] Closing an Exhibit opened by URL lands in the Hall at the default spawn point
- [ ] An unknown slug or an empty hash shows the Hall with no error
- [ ] Opening from the Hall sets the hash; closing clears it
- [ ] Browser back and forward between the Hall and an Exhibit behave sensibly
