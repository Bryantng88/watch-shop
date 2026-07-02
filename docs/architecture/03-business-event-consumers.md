# BusinessEvent Consumers

Business domains emit `BusinessEvent` only.

Consumers react to events:

- Workflow
- Notification
- Activity/Timeline projection
- Space Management

The event consumer pipeline allows additional consumers later:

- Approval
- Audit
- Analytics

Rules:

- Consumers should not change business domain behavior.
- Consumer failures should be isolated where appropriate.
- Activity/Timeline projection should resolve relationships through Items, not
  through URL context or direct domain calls.

The old ExecutionContext idea remains rejected/deferred because Item persistence
already provides relationship mapping between Workspace and business objects.

Implementation note:

- Legacy code may still contain `BusinessBinding` names.
- New application-layer code should prefer Item vocabulary.
