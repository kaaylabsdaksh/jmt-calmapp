# Modern Manage PM / Interim Check Templates

## Goal
Replace the small Templates dialog with a dedicated full-page experience using the selected banded master-detail design and the existing CalMApp design system.

## Build
- Add a Templates page reached from **Manage PM / Interim Checks → Manage Templates**.
- Provide compact Status, Doc/Tool, and Description filters with Search, Clear, and Add New actions.
- Show a dense, paginated template table with expandable revision-history rows.
- Add inline full-width Add/Edit bands for status, revision, description, active document, replacement upload, replacement reason, audit details, and linked schedule information.
- Support local mock create/update, Active/Inactive changes, file selection display, validation, Save, and Cancel.
- Add the route, breadcrumb trail, and hide unrelated shared header actions on this page.

## Technical details
- Keep mock React state only; no backend or new dependencies.
- Use existing semantic tokens, Work Sans typography, compact controls, shared buttons, badges, tables, and notifications.
- Remove Templates from the old management dialog while leaving Manage Schedules unchanged.
- Verify navigation, search, expansion, Add New, Edit, save/cancel, and page rendering in the preview.
