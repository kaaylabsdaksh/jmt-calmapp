# Modern Create Lab Standard Work Orders

## Goal
Turn the existing Standards footer action into a complete modern workflow matching the supplied legacy screens while preserving CalMApp’s compact visual system.

## What will be built
- Add a dedicated Create Lab Standard Work Orders page opened from the existing Standards footer button.
- Add Date From, Date To, and comma-separated Standards to Exclude controls with validation.
- Support the full sequence: empty state, Refresh Preview, expandable preview groups, Process Run, and completed live-data state.
- Show grouped work orders by account with counts and expandable item details: WO Number, Account, Report Number, Created Date, Calibration Frequency, Serial, Customer ID, PO Number, and Action.
- Enable Export Counts and Export Work Orders only after processing, using downloadable CSV files.
- Add clear preview/live-data messaging, compact action controls, sticky page header, and standard back navigation.

## Technical details
- Use local React state and existing Standards mock data; no backend or new dependencies.
- Reuse ModernDatePicker, Button, Input/Textarea, Table, collapsible interaction patterns, notifications, and semantic design tokens.
- Add the new route and breadcrumb metadata under Equipment / Standards / Manage Standards / Create Lab Standard Work Orders.
- Verify validation, preview refresh, row expansion, processing, downloads, navigation, and desktop/mobile layout.
