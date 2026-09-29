# Modern Reports

## Goal
Add a modern Reports workspace under **Core Operations → Reports**, preserving the legacy report catalog while making selection and report criteria easier to scan and use.

## What will change
- Add a `/reports` page with the standard sticky app header and breadcrumb.
- Turn the legacy radio-list into a compact searchable report catalog with clear categories and a selected state.
- Show the selected report’s criteria in a focused panel; start with the legacy Blank Datasheets work-order field and support sensible contextual inputs for the other report types.
- Add **Create PDF** as the primary action, **Clear** for criteria, and a concise large-report processing notice.
- Wire **Core Operations → Reports** to the page and add its title/breadcrumb metadata.
- Keep the experience mock/local and preserve every report name visible in the supplied legacy screenshots.

## Verification
- Confirm sidebar navigation opens Reports and marks it active.
- Check report search, selection, criteria changes, Clear, and Create PDF feedback.
- Verify desktop layout, narrow viewport behavior, and current build health.

## Technical details
- React state only; no new packages or backend changes.
- Reuse existing design-system cards, inputs, selects, buttons, alerts, and semantic color tokens.
- Record the new top-level route in the project architecture notes.
