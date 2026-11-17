# Operations centre: live queue and insight layout

The working queue list occupies two thirds of the desktop content, with a
one-third insight column visible by default from 1280px. Narrow layouts keep
queues first and collapse the insight section below them. Native disclosures
retain detailed concentration metrics and the seven-day order completion series.

Each row leads with its domain and one actionable insight. Stage counts remain
quiet secondary links; the domain total is tertiary. Domain colors come from
ADMIN_DOMAIN_TONE. The sidebar uses a shared zero-based quantitative axis,
endpoint counts and colored bars, without a remainder/progress track. Axis and
category order stay fixed when changing view using AdminViewTabs.

## Execution counts

Counts cover the complete open population, not paginated board samples:

- Purchase requests: WAITING and PROCESSING are explicit execution states.
- Personal work: TODO and IN_PROGRESS, within the existing access query. Events
  have no completion workflow and remain unclassified for execution filters.
- Technical: current projection executionStatus OPEN/CONFIRMED means waiting;
  IN_PROGRESS means active. A PROCESSING pipeline label is not an execution fact.
- Media: partial saved section completion means active. Fully completed sections
  awaiting a transition are waiting; explicit IN_PROGRESS is active, and NEW,
  RETURNED, REVIEW, ASSETS_DOWNLOADED are waiting when no partial progress exists.
  Missing/unsupported state remains unclassified. MEDIA_PROCESSING alone does
  not imply active work. The signal describes the recorded workflow, not live
  human presence.
- Order fulfilment buckets and payment unpaid status do not prove whether work
  has started. These queues remain unclassified in the execution split.

All = waiting + active + unclassified. Unclassified items stay in All; filtered
views display a dash for a wholly unclassified queue, a plus for a partial count,
and a visible coverage explanation. Unknown never silently becomes zero.
Projection counts select the latest entity record at the current projection
version. Reconciliation falls back to unknown when classified totals exceed the
queue population, rather than displaying contradictory totals.

No workflow transitions, domain ownership, permissions, or production data are
changed by this read-only dashboard. Synthetic UI/test data never enter runtime
queries.
