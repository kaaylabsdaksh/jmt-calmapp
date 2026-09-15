# Convert Manage Stations to a Full Page

## What will change
- Add a dedicated **Manage PM / Interim Check Stations** page under Standards.
- Preserve the existing station search, expandable standards table, pagination, and Add/Edit station forms.
- Change the **Manage Stations** button on PM / Interim Checks to navigate to the new page instead of opening a dialog.
- Add the page title and breadcrumb trail: **Equipment / Standards / Manage Standards / Manage PM / Interim Checks / Manage Stations**.
- Keep Cancel in Add/Edit returning to the stations list on the same page.

## Technical details
- Refactor the current station manager so its content renders as a normal full-page view with the shared sticky page header.
- Register a dedicated route before the dynamic standard-detail route.
- Remove the stations dialog state and import from the PM / Interim Checks page; templates and schedules remain dialogs.
- Verify navigation, search, expansion, Add New, Edit, Cancel, Save, pagination, and responsive scrolling.
