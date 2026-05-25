## Mobile responsiveness — scope and plan

This is a large enterprise app (19 pages, several files >5k lines, many wide data tables and multi-column forms). True mobile parity requires layout work on every screen. Doing it all in one pass would produce thousands of risky line changes, so I'll do it in phases. After Phase 1 most screens will be usable on mobile; Phases 2–3 polish the heavy screens.

### Phase 1 — Global foundations (this pass)
The shadcn `Sidebar` already supports a mobile Sheet drawer, but `SidebarLayout` never renders the trigger and pages use desktop-only padding. I will:

1. **Sidebar as mobile drawer** — add a sticky top bar (visible only `<md`) with a `SidebarTrigger` hamburger + page title slot. Desktop layout unchanged.
2. **Container padding** — switch hard-coded `px-6/px-8` page wrappers to `px-3 sm:px-4 lg:px-6` and remove fixed `min-w-[…]` values that cause horizontal overflow.
3. **Tables** — wrap every data table in `overflow-x-auto` so wide tables scroll horizontally on phones instead of breaking layout.
4. **Form grids** — change `grid-cols-2/3/4` and 2-column flex rows in forms to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-N`. Header rows with many fields stack on mobile.
5. **Dialogs / sheets** — cap dialog widths with `max-w-[95vw]` and make tab strips scroll horizontally.
6. **Footers** — fixed action footers become `flex-col sm:flex-row` with full-width buttons on mobile.

### Phase 2 — Heavy list pages (next pass, on request)
ESL Items, Work Order tables, Logistics, Shipping, Customer Pickup: convert column-dense tables to card layouts under `md`, collapse filter bars into a "Filters" sheet, simplify toolbars.

### Phase 3 — Form-heavy pages (on request)
FormVariationsDemo, AddNewWorkOrder, EditOrder, EditBatchWorkOrder: rework tab strips, batch grids, and inline edit bars (like the ESL inline editor we just built) for thumb-friendly use.

### What I won't change
- Business logic, data, routing, or feature behavior.
- Desktop appearance — all changes are guarded by Tailwind breakpoints.

### Technical notes
- New file: `src/components/MobileTopBar.tsx` (hamburger + brand, `md:hidden`).
- Edit `SidebarLayout` to render it above `<main>`.
- Sweep pages with ripgrep for `px-6|px-8|grid-cols-[234]|min-w-\[` and adjust.
- No new dependencies.

Confirm and I'll start with Phase 1.