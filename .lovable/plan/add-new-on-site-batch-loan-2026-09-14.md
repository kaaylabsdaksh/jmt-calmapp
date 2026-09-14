# Add New On-Site Batch Loan

## Goal
Update the existing Add New flow to match the supplied batch-entry workflow while retaining the current CalMApp visual system.

## Changes
- Expand the loan details with Batch ID/status, account, from/to location and division, from/to user, needed and expected-return dates, and created/moved/returned audit details.
- Keep generated and lifecycle fields read-only until applicable.
- Add a Standard # entry area where users can add multiple standards before saving.
- Show added standards in a compact table with Standard #, asset state, next calibration date, manufacturer, model, serial, lab code, and Remove.
- Validate required loan details and require at least one standard before saving.
- Preserve the existing Standards page, loan search, results table, and detail view.

## Technical Details
- Continue using local React state and mock Standards data; no backend or new dependency.
- Use existing compact inputs, date picker, selects, buttons, table, dialogs, and shared notifications.
- Store the selected standards on the created loan so they are visible in the loan detail view.
- Verify adding/removing standards, validation, loan creation, and the final table state in the browser.
