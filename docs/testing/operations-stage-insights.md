# Operations dashboard stage insights

Stage counts describe open work. A stage is highlighted when it contains at
least three items and at least 60% of its area's open work. The denominator is
the area's `activeCount`, since order stage filters can overlap. This is a
concentration signal, not an SLA breach or a completion percentage.

The focus panels retain links to the stage's operational list. Metrics have
inline explanations under **Cách tính chỉ số**:

- Inactivity is time since the last business update, not time in stage or
  hands-on processing time. Future timestamps are clamped to zero; missing
  timestamps remain unavailable. Seven-day inactivity is not an SLA.
- Media checklist completion divides completed steps by recorded checklist
  steps, with the board's four-step normalization. Coverage states how many
  current items have checklist data. It is not the proportion of work at a stage.
- Media throughput uses recorded workflow start/completion timestamps on
  execution bindings. Purchase request waiting ends at processing start or
  closure; processing ends at closure. Cancelled records are excluded.
- Completed throughput counts recorded workflow occurrences ending in the
  trailing 168 hours. Mean handling time uses those same completed occurrences,
  from start to end, including waiting time. It is not the age of open work.
- Completion rate uses a separate cohort: occurrences starting in the trailing
  168 hours, divided into those completed by now and all starts. Empty cohorts
  and absent completion timestamps show an em dash, not 0%.
- Workflow history is not available for every area. Orders, payments, technical
  and personal work currently expose inactivity metrics; no historical handling
  time is inferred from their `updatedAt`. Media and purchase request workflow
  metrics reflect the timestamps currently retained, not deleted/replaced history.

Projection statistics aggregate all latest projection entities, independent of
the board's 100-row page. Personal-work statistics use the same creator,
assignee and explicit share access as the dashboard's personal queue. Zero-count
stages remain visible, without creating concentration panels.

Verify with `tsx --test src/domains/admin-home/application/stage-insights.test.ts`,
TypeScript, changed-file lint, and a local dashboard browser check. Inspect both
a concentrated stage and a 1/1 queue; only the first should create a focus panel.
`tsx scripts/smoke-operations-stage-insights.ts` runs SQL fixtures against a
guarded loopback test database. Its session-private temporary tables are dropped
at transaction end; it does not mutate the public business tables. It checks
full aggregation beyond 100 records, deduplication, completion-window versus
cohort semantics, cancellation/invalid dates, and personal owner/share isolation.
