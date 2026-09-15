# Modern Manage PM / Interim Checks

## Goal
Convert the legacy Manage Preventative Maintenance / Interim Checks screen into a compact modern Standards workflow while preserving its filters, expandable results, history, and management actions.

## What will be built
- Add a dedicated Manage PM / Interim Checks page opened from Manage Standards.
- Recreate the legacy search criteria for schedule, standard, location, division, station, frequency, document/tool, lab code, account, due dates, terminal dates, completion details, and optional history.
- Add a Schedule/Standard view selector, active-filter summary, Search, Clear, and CSV Export actions.
- Show a dense, sortable, paginated results table with Active and Completed status badges.
- Support expandable schedule rows with completed-check history details.
- Add modern Manage Stations, Manage Templates, and Manage Schedules dialogs with representative editable mock data.
- Use the breadcrumb Equipment / Standards / Manage Standards / Manage PM / Interim Checks.

## Technical details
- Use local React state and mock Standards data only; no backend or new dependencies.
- Reuse ModernDatePicker, Button, Select, Table, Dialog, Tooltip, pagination, notifications, and semantic design tokens.
- Add the route and connect the existing Manage PM / Interim Checks footer action.
- Verify filtering, completion-history behavior, row expansion, export, pagination, dialogs, and desktop/mobile layout.
