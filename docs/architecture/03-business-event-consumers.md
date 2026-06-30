# BusinessEvent Consumers

Business domains emit `BusinessEvent` only.

Consumers react to events:
- Workflow
- Notification
- Timeline

The event consumer pipeline allows additional consumers later:
- Approval
- Audit
- Analytics

Rules:
- Consumers should not change business domain behavior.
- Consumer failures should be isolated where appropriate.
- Timeline projection should resolve relationships through `BusinessBinding`, not through URL context or direct domain calls.

The ExecutionContext idea was rejected/deferred for Timeline routing because `TaskExecution`/`BusinessBinding` already provides relationship mapping.

