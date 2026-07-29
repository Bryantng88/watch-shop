# Service Movement Measurement Contract

## Scope

This contract applies to every Service or Technical Issue surface whose area is
`MOVEMENT`, including Quick Preview, full Technical Assessment, inline
assessment, board, and future operational views.

## Ownership

- `Watch.movementCalibre` is the canonical operational movement code.
- `WatchSpecV2.calibre` is kept synchronized for the existing Watch Spec read
  contract.
- A Service modal must not create a third calibre field.
- `TechnicalAssessment` owns the current before/after measurement snapshot for
  a Service Request.
- Technical Issue owns the work item; it does not own Watch specifications.

Updating calibre from Service must use the shared movement-measurement service,
update both current Watch representations in one transaction, and emit
`watch.spec.updated` only when the value changes.

## Measurement Fields

Mechanical watches use:

- `preRate` / `postRate`: seconds per day (`s/day`);
- `preAmplitude` / `postAmplitude`: degrees (`°`);
- `preBeatError` / `postBeatError`: milliseconds (`ms`).

Battery/quartz watches require calibre but do not expose or persist mechanical
timegrapher measurements. If a watch changes from mechanical to battery, the
mechanical snapshot is cleared by the movement-measurement command.

## UI Contract

- Every `MOVEMENT` issue shows the calibre field.
- Mechanical issues show compact Before and After groups.
- Battery issues show calibre only.
- Units remain visible beside numeric inputs.
- Opening an existing modal hydrates Watch calibre and current assessment
  values.
- Saving and reopening the modal must show the persisted values.
- The read-only preview shows calibre and compact before/after summaries.

## Performance And Events

- Load Watch movement identity and Technical Assessment in the existing modal
  query; do not add per-field or per-row requests.
- Do not load measurement history on board/list cards.
- Calibre changes emit `watch.spec.updated` so Watch projections and Activity
  reconcile through the standard event path.
- Technical Issue updates continue through the existing
  `technical_issue.updated` command/event path.
- UI code never writes Watch or Technical Assessment tables directly.

