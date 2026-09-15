# Modern Manage Manufacturers

## Goal
Convert the legacy Manage Manufacturers screens into a compact modern Product & Customer workflow while preserving the list, filtering, paging, and manufacturer maintenance fields.

## What will be built
- Add a dedicated Manage Manufacturers page accessible from the Product & Customer sidebar.
- Show a dense manufacturer table with ID, manufacturer, full name, website, ASC info file, date added, and status.
- Add compact per-column filters, clear filtering, sorting, paging, and page-size controls.
- Make manufacturer names open an Edit Manufacturer form.
- Add an Add New Manufacturer form with Status, Date Added, Manufacturer, Full Name, Website, and ASC Info fields.
- Use the standard sticky page header, compact controls, status badges, and right-aligned Cancel/Save footer actions.

## Technical details
- Use local React state and representative mock manufacturer data only.
- Add the route, Product & Customer sidebar link, and matching breadcrumbs.
- Reuse the existing Button, Input, Select, Table, Badge, date picker, pagination, and notification patterns.
- Validate required fields and verify filtering, pagination, Add, Edit, and navigation in the live preview.
