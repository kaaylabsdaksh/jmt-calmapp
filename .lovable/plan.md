Goal: Add a user toggle on `/invoicing` that switches between the existing **Invoices** view and a new **Billing Specialist** view matching the provided reference image.

Scope of work:
1. **View-mode state**
   - Add `viewMode` state with values `"invoices" | "billingSpecialist"`.
   - Default to the current Invoices view so existing behavior is unchanged.

2. **User toggle**
   - Add a visible toggle control (segmented button or tab-like switch) labeled **Invoices** / **Billing Specialist**.
   - Place it in the page header area so it is obvious and persists across the page.

3. **Billing Specialist view** (rendered when `viewMode === "billingSpecialist"`)
   - **Title**: Change top nav title to "Invoicing (Billing Specialist)".
   - **Filters**: Replace the current filter row with the six fields from the image:
     - Invoicing Type
     - Work Order Type
     - Location
     - Division
     - Invoice Status
     - Customer Group
   - **Action buttons**: Add a centered row with:
     - Clear
     - Menu
     - Invoicing
     - Delivery Tickets
     - Process Invoice(s)
   - **Table**: Replace the main invoice table with columns shown in the image:
     - WO Batch, Acct #, SR#, Customer Name, RTB Count, Total Count, Last Comment Date, Last Comment, Min Need By Date, Min RTB Date, To Shipping, Sales Order
     - Each column header includes a compact sub-filter input.
     - Start with the "No data to display" empty state shown in the image.
   - **Footer**: Add a centered footer with:
     - Process Invoice(s) button
     - Text links: "Set Default View" and "Set Search Field Defaults"

4. **Invoices view** (existing behavior)
   - Keep the current filters, table, reports section, sticky footer, and selection bulk-action bar exactly as they are now.

5. **Data**
   - Use local mock state for the Billing Specialist table (empty by default, matching the reference image).

No backend changes are required; this is a frontend-only presentation feature.