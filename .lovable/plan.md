# Edit On-Site Batch Loan

## Goal
Replace the simple ID details popup with a modern Edit Batch experience matching the supplied workflow.

## Changes
- Open Edit Batch when a user selects a batch ID or view icon.
- Show Batch ID, account/customer, status, locations, divisions, users, needed/return dates, and lifecycle audit details.
- Show a Batch Report action for completed batches.
- Display all standards assigned to the batch in the same compact table used by Add New.
- Allow standards to be added or removed while a batch is Open.
- Add Save, Cancel Batch, Move, and Return actions with availability based on status.
- Keep completed and cancelled batches read-only while retaining Back/Close behavior.

## Technical Details
- Extend local mock records with representative standards and lifecycle data where needed.
- Keep all interactions in local React state with existing controls and shared notifications.
- Verify ID opening, status-specific controls, standard editing, and lifecycle transitions in the browser.
