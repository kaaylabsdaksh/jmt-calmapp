# Add Capable Locations to Edit Product

## Goal
Add the same detailed Capable Locations experience from Add New Product to the Edit Product page.

## Changes
- Add a Capable Locations tab alongside General, Files, Accessories, and 17025.
- Reuse the same location-by-capability matrix and definitions shown on Add New Product.
- Initialize each location from the product’s existing capable-location data.
- Keep matrix selections editable while preserving the existing General-page location chips and 17025 scope tab.

## Technical Details
- Use local React state and existing table, checkbox, card, and design-system controls.
- Add no dependencies or backend changes.
- Verify the tab, existing location selections, matrix interaction, and page layout in the browser.
