# Modern Manage PM / Interim Check Stations

## Goal
Replace the simple Manage Stations list with a complete modern station-management workflow based on the supplied legacy screens.

## What will be built
- Add a searchable station list with Type, Location, Division, Description, Name, Account #, Lab Code, and Standard # filters.
- Show a dense station results table with expandable rows for linked standard details, pagination, and a clear record count.
- Add an Add New Station form with station identity fields, multi-select lab codes, audit information, and standards entry.
- Add an Edit Station form with existing values, linked standards with removal, schedule information, and comments.
- Keep all station changes in local mock state and return to the station list after saving.
- Preserve the current Manage Templates and Manage Schedules dialogs unchanged.

## Technical details
- Implement the station list and station editor within the existing PM / Interim Checks page using React state and existing UI components.
- Use the existing Standards dataset to resolve standard number, manufacturer, model, and description details.
- Add no backend work or dependencies.
- Verify search, clear, expansion, add, edit, standards add/remove, comments, pagination, and dialog navigation.
