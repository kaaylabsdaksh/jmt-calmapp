# Modern direct Product Review workflow

## Goal
Replace the current direct jump from **Product Reviews > Add New** with a complete modern, in-app Product Review workflow matching the supplied legacy screens while preserving the app’s compact visual system.

## User flow
1. **Create the Product Review**
   - Open a General screen with PR status, existing-customer choice, account lookup, customer and shipping details, related document references, contact selection, and contact details.
   - Keep the audit information visible and provide Back, Delete PR, and Save actions in the sticky footer.
   - Saving creates a local mock PR number and enables the PR Items workspace.

2. **Manage PR items**
   - Add a General / PR Items tab switcher.
   - Show a compact PR-items table with item, manufacturer, model, description, location, division, created/due/completed dates, and status.
   - Reuse the shared work-order comments experience below the PR content.
   - Keep Back and Delete PR available in the sticky footer.

3. **Add a PR item through a guided sequence**
   - Step 1: manufacturer and model search, including **Not in CalMapp** and **Unknown** controls plus matching-product results.
   - Step 2: product description.
   - Step 3: calibration-history question, conditional calibration reason, and datasheet/test-report availability.
   - Step 4: review the entered information before adding the item.
   - Use a compact progress indicator and Back / Next / Cancel controls; keep all entered values when moving between steps.

4. **Open the created PR item details**
   - After Add, show the existing modern PR Item Details experience populated from the wizard instead of fixed sample values.
   - Include status, due date, location/division, work details, specifications, accreditation/cost choices, capable locations, documents, hours, audit history, and lifecycle actions.
   - Show a duplicate manufacturer/model warning when the entered pair matches a sample open PR.
   - Returning to PR Items shows the newly added item immediately.

## Behavior and validation
- Keep this frontend-only with local mock state, consistent with the current Product Reviews module.
- Require account/customer details before the PR can be saved.
- Require manufacturer, model, description, and calibration answers before the item can be added, except where **Unknown** is selected.
- Keep status changes, document uploads, hours, comments, and capable-location selections within the active PR session.
- Cancel/back actions return to the correct previous screen without losing the PR unless the user explicitly deletes it.

## Visual treatment
- Use the existing Work Sans typography, semantic colors, compact controls, sticky opaque page header, dense tables, and standard sticky footer.
- Use neutral functional text and the established green Save action.
- Use modern cards/bands only for distinct form groups; avoid reproducing the legacy yellow panels or excessive empty space.
- Ensure the flow works at desktop and mobile widths without overlapping labels or controls.

## Verification
- Verify Add New opens General, Save enables PR Items, and Add New Item advances through every step.
- Verify conditional calibration fields and required-field messages.
- Verify Add creates a row, opens populated item details, and preserves edits across tabs.
- Verify comments, documents, hours, capable locations, footer actions, and return navigation.
- Check TypeScript, the preview build, and the full flow in the browser at desktop and mobile sizes.
