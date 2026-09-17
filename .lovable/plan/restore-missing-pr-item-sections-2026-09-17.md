# Restore missing PR item sections

## Goal
Restore the three missing item-level screens without changing the approved single-page PR Item Details layout.

## Changes
- Add an item navigation bar with **PR Item Details**, **Capable Locations**, **Documents**, and **Hours**.
- Keep the current legacy-style details form unchanged under **PR Item Details**.
- Move the existing capable-location choices into their own screen and preserve selections while switching screens.
- Add a compact Documents screen with file selection, document type and description, an uploaded-files table, and remove actions.
- Add a compact Hours screen with date, technician, work type, hours, notes, an Add Hours action, totals, and removable entries.
- Keep all data local to the active Product Review session, matching the existing mock-data workflow.

## Verification
- Open an existing PR item and confirm all four screens are available.
- Switch between screens and confirm entered selections, documents, and hours remain present.
- Confirm file add/remove and hours add/remove actions work.
- Verify desktop and narrow layouts, TypeScript, and the preview build.
