# Improve Manage Schedules and Add Schedule

## Goal
Refresh both schedule screens using the existing CalMApp design system and Work Sans typography. Keep every current field, lifecycle action, validation rule, linked-standard view, history, comments, search behavior, and pagination intact.

## Manage Schedules
- Reorganize Search Criteria into three compact horizontal groups: schedule identity, assignment, and dates/status.
- Add a concise results summary band showing total, active, pending, and attention-needed counts from the current records.
- Improve the dense schedule table with stronger row hierarchy, clearer schedule links, compact status/frequency presentation, and a more polished expanded-history area.
- Retain sticky table headings, sticky first columns, expandable rows, and the bottom Back/pagination bar.

## Add / Edit Schedule
- Replace the current split-column form with structured full-width bands:
  1. Schedule overview and lifecycle status
  2. Template and station assignment
  3. Frequency and date settings
  4. Linked standards
  5. Audit information
- Keep required fields visually clear and improve empty/read-only states.
- Preserve existing History and shared Comments sections for saved schedules.
- Keep Back and lifecycle/Save actions in the sticky footer, with the primary action clearly emphasized.

## Technical details
- Update only `ManagePmSchedules.tsx`; no data model, routing, dependency, or backend changes.
- Use existing semantic colors, shared controls, status badges, and date pickers.
- Verify the list, Add New Schedule, and an existing schedule at desktop and narrow widths; confirm no overflow, broken actions, or build errors.
