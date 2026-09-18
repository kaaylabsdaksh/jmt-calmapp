# Modern Assign Departure Information

## What will be built
- Add a dedicated **Assign Departure Information** screen opened from the Work Orders sidebar action.
- Keep the legacy flow: search by work order number, select one or more matching items, choose departure date and type, then assign the update.
- Show the same departure types: JM Driver Dropoff, Customer Pickup, Customer Surplus, and Shipped.
- Reveal Shipping Method and Tracking Number only when **Shipped** is selected.
- Use a compact modern search/details layout, dense selectable results table, select-all/clear-all controls, record count, validation, and confirmation message.
- Include Back and Menu navigation in the sticky footer.

## Technical details
- Add a frontend-only page using local mock work-order data and existing design-system controls.
- Add the route and connect the existing sidebar and command-palette action to it.
- Preserve the selected rows after field changes and update their displayed departure information after assignment.
- Verify search, selection, conditional shipping fields, assignment, navigation, and desktop/mobile layout.
