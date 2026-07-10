# Sprint 73 - Watch Intake With Required Suspicion

Status: closed.

## Goal

Replace Watch List Service Operation intake with
`watch_intake_with_suspicion` so a newly created Service Request is never empty.
The first user-entered suspicion creates the first Technical Issue through the
Service domain command path.

## Scope

- Watch List opens a small intake modal instead of silently calling
  `watch_intake`.
- The modal requires the first technical suspicion before creating a new SR.
- The API accepts `watch_intake_with_suspicion`.
- The Service quick path creates a ServiceRequest, then creates the initial
  TechnicalIssue through `createTechnicalIssue`.
- `technical_issue.created` remains the event handoff to Coordination / Inspect.
- If an active SR workspace already exists, the user is prompted to open it
  instead of creating duplicate Service Requests or duplicate first issues.

## Files Touched

- `src/domains/watch/client/WatchListClient.tsx`
- `src/app/api/admin/service-operation/route.ts`
- `src/domains/service/server/watch-quick/watch-active-service.service.ts`

## Implemented

- Watch List Service action now opens a modal with required suspicion text.
- POST `/api/admin/service-operation` supports:
  - legacy `watch_intake`;
  - new `watch_intake_with_suspicion`.
- New server command `watchIntakeWithInitialSuspicion`:
  - detects active SR/workspace and returns `EXISTING_WORKSPACE` without
    creating a duplicate issue;
  - creates a quick ServiceRequest only when no active SR exists;
  - creates the first TechnicalIssue via `createTechnicalIssue`;
  - emits `service_request.created` after the initial issue exists;
  - returns the SR workspace href when Coordination creates/binds it.

## Acceptance Status

- New Watch service intake requires a technical suspicion: done.
- Newly created SR gets an initial TechnicalIssue: done.
- Initial TechnicalIssue emits `technical_issue.created`: done through
  `createTechnicalIssue`.
- Existing active SR prompts open-existing behavior instead of duplicate
  creation: done.
- No Service `spaceId` / `workspaceId`: preserved.
- API auth boundary returns 401/403 through `requirePermissionApi` instead of
  catching page redirects as generic request errors: done.

## Validation

- `npx eslint src/app/api/admin/service-operation/route.ts src/domains/service/server/watch-quick/watch-active-service.service.ts src/domains/watch/client/WatchListClient.tsx --quiet --rule "@typescript-eslint/no-explicit-any: off"`
  - Passes.
- `GET /api/admin/service-operation?range=ALL_ACTIVE`
  - Returns HTTP 200 on the running local dev server.
- Unauthenticated `POST /api/admin/service-operation` with
  `watch_intake_with_suspicion`
  - Returns HTTP 401 on the running local dev server.
- Default lint on `watch-active-service.service.ts` is still blocked by older
  `@typescript-eslint/no-explicit-any` debt in that file.

## Notes For Live Smoke

- Full live creation smoke requires an authenticated admin session and writes
  real ServiceRequest / TechnicalIssue data. Use a test watch and verify:
  - create SR from a watch with no active service;
  - verify SR workspace opens;
  - verify initial TI appears in Inspect;
  - verify a second click on the same watch prompts to open existing workspace.
- The compact Watch List modal intentionally remains local UI for this sprint;
  the action key is aligned with `OperationalBlueprint.actions`, and a future
  sprint can decide whether external action launchers render directly from the
  contract form schema.
