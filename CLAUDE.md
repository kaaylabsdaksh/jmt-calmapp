# CLAUDE.md — Onsite Scheduling module

Guidance for Claude when working on the **Onsite Scheduling** module in this app.

---

## 0. Path variables

Declared once, referenced by name everywhere below. Edit these two values if the
projects live elsewhere on your machine; never hardcode a path anywhere else.

| Variable | Meaning | Value |
|---|---|---|
| `{{LOVABLE_APP}}` | **This app.** Where the module lives. | `C:\Projects\lovable-jmt-calmapp` |
| `{{DEMO_APP}}` | **Upstream source.** The onsite-scheduling prototype — read-only. | `C:\Users\rider\Downloads\jmt-calmapp-feature-onsite-scheduling-prototype\jmt-calmapp-feature-onsite-scheduling-prototype` |

Derived shorthands (do not re-define):

| Shorthand | Expands to |
|---|---|
| `{{DEMO_PROTO}}` | `{{DEMO_APP}}/prototype/src-overrides` |
| `{{DEMO_DOCS}}` | `{{DEMO_APP}}/prototype/handoff` |
| `{{LOVABLE_SRC}}` | `{{LOVABLE_APP}}/src` |

---

## 1. Status

The module has been **ported in full** from `{{DEMO_PROTO}}`. Every UI file in the
source now has a counterpart here, and 17 of 24 are byte-identical to the demo apart
from import paths. The seven that differ are listed in §4 — those are the only
intended deviations.

**Two implementations coexist on purpose** — do not delete either without asking:

| Route | Page | What it is |
|---|---|---|
| `/onsite-scheduling` | `pages/OnsiteScheduling.tsx` | The full demo port. The one this document is about. |
| `/onsite-scheduling-prototype` | same | Alias, matching the demo's own route name. |
| `/onsite-scheduling-v2` | `pages/OnsiteSchedulingV2.tsx` | The earlier, lighter in-house screen, kept for comparison. Its own tree: `components/onsite/`, `lib/onsite/schedulingData.ts`, `context/SchedulingDataContextV2.tsx`. |

Both are in the sidebar under **Project Management**, and both support
`?tab=list|calendar|unscheduled`.

The two trees are deliberately **separate down to the context**: V2 uses
`SchedulingDataContextV2` because its store shape (`entries`, `unscheduled`,
`upsertEntry`, …) differs from the ported one (`nonServiceEntries`,
`unscheduledWork`, `addNonServiceEntry`, …). Never merge the two contexts or
cross-import between `components/onsite/` and `components/onsite-scheduling/`.

`{{DEMO_APP}}` is **read-only**. Read it to compare against; never edit it.

---

## 2. Where the code lives

```
{{LOVABLE_SRC}}/
├── pages/OnsiteScheduling.tsx            ← shell: header + 3 tabs, mounts JobDetailDialog once
├── context/
│   ├── SchedulingDataContext.tsx         ← the in-memory store behind all three tabs
│   └── OpenDecisionsContext.tsx          ← decision-review widget state
├── components/onsite-scheduling/
│   ├── CalendarView.tsx                  ← month grid, continuous multi-day spanning bars
│   ├── CalendarFilterBar.tsx             ← filters + active-filter / hidden-count readout
│   ├── CalendarViewsMenu.tsx             ← saved-views popover + Clear
│   ├── SchedulingListView.tsx            ← List tab (was PrototypeListView)
│   ├── UnscheduledWorkQueue.tsx          ← queue + Schedule dialog
│   ├── JobDetailDialog.tsx               ← the one shared job dialog
│   ├── NewEntryChooser.tsx / NewJobDialog.tsx / NonServiceEntryDialog.tsx
│   ├── QuickAddWorkDialog.tsx / TechnicianRosterPicker.tsx / VanSuggestionPanel.tsx
│   ├── CommentThread.tsx / DecisionTag.tsx
│   └── OpenDecisionsPanel.tsx / ExportResultsDialog.tsx / GlobalOpenDecisions.tsx
└── lib/onsite-scheduling/
    ├── types.ts / mock-data.ts / job-status.ts / job-draft.ts
    └── conflict-check.ts / saved-views.ts / van-suggestion.ts / system-decisions-seed.ts
```

Wiring touch points: the route and `OpenDecisionsProvider` in `App.tsx`, the nav entry
in `AppSidebar.tsx`, and the `routeMeta` entry in `modern/ModernTopNav.tsx`.

---

## 3. Ground rules

1. **Mock data only.** No auth, no API client, no TanStack Query provider, no Redux in
   this app. State is React context + `useState`. Do not add any of them.
2. **The demo is the visual spec.** When changing a screen, open the matching file under
   `{{DEMO_PROTO}}` first. Do not redesign, simplify, or "modernize" layout that came
   from there.
3. **Tailwind classes port verbatim.** Both projects define the same tokens
   (`--primary: 54 100% 57%`, `--background: 0 0% 98%`, `--border: 0 0% 91%`,
   `--radius: 0.5rem`). Never substitute `bg-yellow-400` for `bg-primary`.
4. **Zero new dependencies.** The whole module runs on what was already installed.
5. **Double quotes** in new files here (Lovable house style); ported files kept the
   demo's single quotes rather than being reformatted, which keeps them diffable
   against upstream. Match whichever file you are editing.
6. **No JIRA keys** in code, comments, or filenames.

### Status colors — two axes, never merged
- **Readiness** (`Red`/`Green`/`Partial`) derives from PO Received + Confirmed across
  *all* of a job's accounts. Shown **color-only**: List's left row border, Calendar's
  bar fill. Never labelled "Status".
- **Lifecycle** (`Active`/`On Hold`/`Completed`/`Cancelled`) is the text badge.

Both maps live in `lib/onsite-scheduling/job-status.ts`. Import them; never retype a
color.

---

## 4. Deliberate deviations from the demo

Everything else is a verbatim port. These seven files differ, and only in these ways:

| File | Change | Why |
|---|---|---|
| `context/SchedulingDataContext.tsx` | dropped the `setJobsSnapshot` effect | It fed `mock-onsite-project-api.ts`, an API interceptor with nothing to intercept here. |
| `components/.../JobDetailDialog.tsx` | dropped `useQueryClient` + `invalidateQueries` | No `QueryClientProvider` is mounted; calling it throws. |
| `components/.../UnscheduledWorkQueue.tsx` | same | Same. |
| `context/OpenDecisionsContext.tsx` | `ROUTES.*` ➜ `/onsite-scheduling`; auto-save POST ➜ local-only | `@/constants` does not exist here, and there is no dev-server plugin to write the file. |
| `components/.../OpenDecisionsPanel.tsx` | corrected the "auto-saves to decision-results.md" copy | It advertised a write that cannot happen here. Export is now the only path out. |
| `components/.../GlobalOpenDecisions.tsx` | `useAuth()` gate ➜ route gate | No auth layer; the widget hides on `/login`. |
| `lib/onsite-scheduling/saved-views.ts` | `SaveResult` members made explicit | This project compiles with `strictNullChecks` off, where the discriminated union did not narrow. The demo never caught it because its tsconfig excludes `prototype/`. |

Four source files were **not** ported, none of which render anything:
`mock-onsite-project-api.ts`, `job-store.ts`, `prototype.skipAuth.ts`,
`prototype.decisionLogServerPlugin.ts`.

The earlier thin implementation was **not** discarded — it lives on as V2 (see §1),
on its own context so the two never interfere.

---

## 5. Known issue inherited from the demo

`VanSuggestionPanel.tsx` renders a `DecisionTag` (itself a `<button>`) inside the
panel's collapse `<button>`, producing a React `validateDOMNesting` warning. The markup
is identical to the demo's, so it was left as-is rather than silently diverging. Fixing
it means changing the demo too, or accepting the divergence.

---

## 6. Verifying a change

```bash
npx tsc --noEmit -p tsconfig.app.json   # must be clean
npm run build                            # must succeed
npm run dev                              # then open /onsite-scheduling
```

Check by hand:
- A multi-week job renders as **one continuous bar in one lane** across week
  boundaries — lanes are assigned per visible month, not per week. This is the most
  fragile detail in the module.
- Unscheduled Work ➜ **Schedule** creates a job visible on Calendar *and* List
  immediately, and clears the queue row.
- A Calendar bar and a List row open the **same** `JobDetailDialog` instance.
- Technician conflicts show a warning with "Assign Anyway" — never a block.
- Readiness shows only as color; the text badge shows lifecycle only.

---

## 7. Reference reading

In `{{DEMO_DOCS}}` — background when a behaviour is unclear; do not copy into this repo:
- `requirements/onsite-ui-ux-standards-v1.md` — governing visual/interaction standard
- `requirements/onsite-scheduling-frd-v5.md` — §6.1 List, §6.2 Calendar, §6.4 non-service
  entries, §6.5 Unscheduled Work, §7 status rules, §8 data model
- `requirements/onsite-scheduling-user-journeys-and-test-data.md` — flows to check against
