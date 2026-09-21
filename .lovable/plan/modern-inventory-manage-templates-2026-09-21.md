# Modern Inventory Manage Templates

## Goal
Create a dedicated modern Manage Templates workflow under **Inventory & Templates**, preserving the search fields, product-inclusive results, expandable validation details, and Add Template process shown in the supplied screens.

## Build
- Add a Manage Templates page linked from the existing Inventory & Templates sidebar action.
- Recreate the compact search criteria: template name, JMT #, comments, lab code, version, status, approved by, approval date range, Include Products, and Include All Versions.
- Reveal Manufacturer, Model, Description, and product Lab Code filters when Include Products is selected.
- Show a dense, horizontally scrollable results table with status, approval, version, comments, and optional product columns.
- Support expandable validated-template rows showing validation user/date, PASS status, work order, manufacturer, model, and comments.
- Add pagination, record count, page-size selection, Clear, Search, Back, and Add Template actions.
- Build an in-app Add Template screen with file selection/drop area, datasheet and worksheet selectors, test/sample preview states, JMT #, lab code, comments, and Move to Templates validation.
- Add route titles and breadcrumbs, keeping this workflow separate from PM / Interim Check templates.

## Technical details
- Use local mock React state only; no backend or new dependencies.
- Reuse the existing CalMApp controls, status badge conventions, sticky header/footer, compact table styling, Work Sans typography, and semantic color tokens.
- Add routes for the list and Add Template screen, and wire the existing sidebar item.
- Verify search, product filters, row expansion, pagination, add-template validation, navigation, and desktop/mobile overflow.
