# Modern Manage PM / Interim Check Schedules

## Goal
Replace the current Manage Schedules pop-up with a dedicated modern workflow that preserves the legacy schedule search, list, creation, editing, activation, cancellation, history, and comments behavior.

## What will change
- Open **Manage Schedules** as a full page under Manage PM / Interim Checks.
- Add a compact **Search Criteria** section for type, station, standard number, description, schedule/completed status, frequency, due dates, and terminal dates.
- Add a separate dense **Schedule Results** table with expandable rows, sticky headers, pagination, Add New, and a sticky footer with Back separated from pagination.
- Open Add New and existing schedules on their own in-app pages with breadcrumbs.
- Build the schedule form with:
  - Template and station selection
  - Linked standard details
  - Status, type, frequency, year, interval, due date, terminal date, and description
  - Created/modified audit information
  - Status-aware Save, Activate Schedule, and Cancel Schedule actions
  - Validation for required values and valid due/terminal dates
- Show schedule history and use the existing shared work-order comments component on existing schedule pages.
- Keep all schedule changes in local mock state, consistent with the current PM / Interim Checks module.

## Technical details
- Extend the PM schedule mock model to support Pending and Cancelled states plus schedule audit/history fields.
- Add dedicated list/detail routes for `/standards/manage-pm-interim-checks/schedules` and its schedule detail pages.
- Update navigation and breadcrumb metadata, and remove the old Manage Schedules dialog.
- Reuse existing compact controls, date picker, status badges, sticky footer patterns, and semantic design tokens.

## Validation
- Verify search, clear, pagination, row expansion, Add New, Save, Activate, Cancel, Back, and comments interactions.
- Verify breadcrumbs and sticky footers at the current desktop viewport.
- Confirm type checking and the preview build are clean.
