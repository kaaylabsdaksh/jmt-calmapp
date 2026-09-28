# Add Warranty tab for single items

## Scope
- Add a **Warranty** tab alongside the existing single-item tabs only.
- Recreate the supplied warranty experience in the current compact design: warranty ID, reported problem, problem found, warranty type, customer charged, save action, comment entry, and warranty/activity history.
- Keep warranty form selections, newly added comments, and saved confirmation in local screen state, consistent with this mock work-order experience.

## Verification
- Confirm Warranty is visible for Single items and hidden for ESL item types.
- Check saving and adding a comment update the screen correctly.
- Verify the page remains usable at desktop and mobile widths with no errors.

## Technical details
- Extend the existing section state in `FormVariationsDemo.tsx` and add the tab to both compact and minimal navigation variants.
- Use the existing design-system controls and semantic styling; no backend or new dependency changes.
