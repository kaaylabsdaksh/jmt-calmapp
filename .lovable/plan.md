# Modern On-Site Batch Loans

## Goal
Create a modern, functional On-Site Batch Loans workspace inside Standards, based on the selected integrated workflow direction and the legacy screens.

## What will be built
- Add a dedicated `/standards/onsite-batch-loans` page opened by the existing Standards footer action.
- Keep the current CalMApp design system, Work Sans typography, sticky header, compact controls, and full-width stacked sections.
- Recreate the legacy filters: Account #, From Location, Created By, Created From, To Location, Batch Loan Status, and Created To.
- Add functional Search and Clear actions with populated mock loan records and a clear record count.
- Add a dense, sortable results table with ID, Account, Customer, Status, From, To, Created By, Created, Needed, and Expected Return.
- Show statuses using the shared soft-pill and status-dot pattern.
- Add a structured Add New Batch dialog with account/customer, movement, status, and date fields; validate required fields and insert the saved batch into the table.
- Make linked batch IDs open a read-only detail dialog so users can inspect a record without leaving the page.

## Technical details
- Frontend-only local React state and mock data; no backend or new dependencies.
- Reuse existing Button, Dialog, Select, Input, Table, Tooltip, and ModernDatePicker components.
- Add the new route to the app and update the Standards footer button to navigate there.
- Use semantic design tokens and existing notification behavior.
- Verify search, clear, create, details, sorting, sticky header, and desktop/mobile layout in the browser.
