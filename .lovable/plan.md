# Modern Station Add/Edit Screen

## Goal
Update the existing full-page Manage Stations Add/Edit experience to match the legacy station screen’s information and workflow, using the current CalMApp design system.

## What will change
- Keep the current station search and results pages unchanged.
- Rework Add New and Edit Station into a compact modern full-page layout.
- Present Station Details and Lab Codes as a balanced top section, including Type, Account, Location, Division, Number, Name, Description, and multi-select lab codes.
- Keep Created/Modified audit information visible near the station details.
- Add a dedicated Standards section with comma-separated entry, Add action, linked-standard details, and removal controls.
- Replace the current schedule summary with a dense Schedule Information table showing Schedule ID, Description, Due Date, Standards Checked, Status, Type, Frequency, and Doc/Tool.
- Preserve Comments in the modern edit experience.
- Keep a sticky footer with Cancel and Save actions.

## Behavior
- Existing station create/edit validation and local mock saving remain intact.
- Editing a station displays its matching active and completed schedule history.
- Schedule IDs and document/tool names are presented as links where appropriate.
- Add New omits schedule history until the station has been saved.

## Verification
- Open an existing station and confirm all legacy fields, standards, audit data, schedule rows, and comments are present.
- Confirm Add New, Save, Cancel, standard add/remove, and lab-code selection continue working.
- Check the full-page layout at desktop width and verify there are no preview errors.
