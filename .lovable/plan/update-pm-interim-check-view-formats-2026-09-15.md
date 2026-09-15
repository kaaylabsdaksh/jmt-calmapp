# Update PM / Interim Check view formats

## Goal
Add the legacy Station and Template viewing formats to the modern PM / Interim Checks page.

## What will change
- Expand the View by selector to include Schedule, Standard, Station, and Template.
- Keep the same search criteria, but apply the legacy Template-view restrictions by disabling Location, Division, Lab Code, and Account when Template is selected.
- Update the results heading and organize rows according to the selected format, while preserving expandable completion history, sorting, pagination, and export.
- Reset pagination when the view format changes.

## Technical details
- Use the existing local mock schedules and UI components only.
- No backend changes or new dependencies.
- Verify all four formats and Template-specific disabled fields in the preview.
