# How Does That Work

A walkable 3D library where every object is a lesson in how something works. The owner adds lessons over time by prompting an agent; the library is the one place to go to learn them.

## Language

**Hall**:
A walkable 3D space the visitor moves through with WASD and mouse look. Exhibits are placed in it.
_Avoid_: World, scene, library, room, place, level

**Exhibit**:
One clickable object in a Hall that teaches exactly one subject, such as the V8 engine or aircraft landing gear. An Exhibit is self-contained and never depends on the Hall or on other Exhibits.
_Avoid_: Lesson, topic, module, thing, item, website

**Walkthrough**:
The guided sequence inside an Exhibit that shows how its subject works one stage at a time. Every Exhibit has exactly one Walkthrough.
_Avoid_: Tutorial, tour, slideshow, animation

**Step**:
One stage of a Walkthrough: a single change to the model plus a short caption explaining it.
_Avoid_: Slide, page, frame, stage

**Free Play**:
The optional mode after the last Step of a Walkthrough where the Exhibit's controls, such as an RPM slider, are unlocked for the visitor to experiment with.
_Avoid_: Sandbox, playground, interactive mode

**Category**:
The tag every Exhibit carries naming its subject area, such as Engines or Aircraft. The Hall ignores it until there are enough Exhibits to group them.
_Avoid_: Wing, section, tag, theme

**Visitor**:
The person walking the Hall and opening Exhibits.
_Avoid_: User, player, student, learner
