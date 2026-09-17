# Match PR Item Documents and Hours

## Changes
- Rebuild Documents as two stacked sections: labeled Add Document fields with a separate upload action, then Attached Documents with count, uploader/date columns, and record/page footer.
- Prefill the existing document shown in the reference while retaining uploaded documents in the current session.
- Rebuild Hours as a two-column layout: Log Time with only Work Performed and Hours, plus Hours History with total, empty/history state, and record/page footer.
- Keep the existing PR Item Details and Capable Locations tabs unchanged.

## Technical details
- Update only the Product Review item workspace presentation and its local Documents/Hours state.
- Use existing design tokens, shared controls, validation, and responsive stacking on smaller screens.
- Verify both tabs visually and confirm the current app build remains clean.
