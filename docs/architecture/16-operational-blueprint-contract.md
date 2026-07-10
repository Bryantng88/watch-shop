# Operational Blueprint Contract

Blueprint M1 made Workspace creation consistent: a Workspace is created from a
Blueprint snapshot, then runs independently. That is still true.

Blueprint M2 raises the bar: a Blueprint must be able to describe a complete
business operation model for a Space/Workspace flow without moving business
truth out of the business domain.

## Boundary

Blueprint defines how work should operate.

Business domains define what is true.

Workspace runtime executes items, workflow, activity, discussion, and
attachments from a Blueprint snapshot.

Blueprint must not become a ServiceRequest, TechnicalIssue, Payment, Order, or
Watch data store. It must not run vendor, cost, payment, or approval business
logic itself.

## Required Contract

An operational Blueprint can define:

- business object types and whether each is workspace identity or item;
- workspace roles and cardinality;
- core flows that group workspace roles into an ordered business flow;
- event routes that create workspaces, bind items, move items, or write
  activity;
- actions exposed by workspace role;
- action form fields and required validation shape;
- the domain command each action calls;
- emitted business events expected after the command succeeds;
- workflow states and transitions owned by a workspace role;
- projection subscriptions required when the operation changes visible state.

This means a new operation should be built by creating:

1. business events and domain commands in the owning domain;
2. an operational Blueprint contract;
3. generic runtime/consumer handling that applies the Blueprint;
4. UI that renders capabilities and forms from the Blueprint contract.

## Service Operation Reference

Service Operation is the first reference contract.

It has these workspace roles:

- `SR_CASE`: one workspace per ServiceRequest.
- `INSPECT`: one technical Inspect receiver per active technical cycle.
- `PROCESSING`: one technical Processing receiver per active technical cycle.
- `DONE`: one Done/Follow-up receiver per active technical cycle.

It has this core flow:

```text
SR_CASE -> INSPECT -> PROCESSING -> DONE
```

The core flow is the source for workspace navigation. A Space can contain many
Workspaces, but Workspaces in the same core flow should be visible together in
the Workspace header navigation, similar to the Media flow:

```text
Photoshoot -> Processing -> Publishing
```

Its business objects are:

- `SERVICE_REQUEST` as workspace identity;
- `TECHNICAL_ISSUE` as the main operation item;
- `PAYMENT` as follow-up item.

Its accepted flow is:

```text
Watch intake with required suspicion
-> service_request.created
-> technical_issue.created
-> SR_CASE workspace + INSPECT item
-> classify TechnicalIssue
-> technical_issue.confirmed
-> PROCESSING item
-> start/update/raise follow-up/complete
-> technical_issue.completed
-> DONE item
-> payment follow-up and SR closure
```

## Implementation Rule

Consumer and UI code must not decide a new operation model by hardcoding
workspace roles, core flow navigation, forms, or projection rules in
feature-specific branches unless the Blueprint contract already declares that
behavior.

Feature-specific code may still exist as an adapter from a Blueprint action to
a domain command. That adapter is the boundary between generic Workspace
operation and business truth.

## Non-goals For This Step

- No Blueprint persistence table yet.
- No publish/version/rollback yet.
- No automatic migration of existing Workspace snapshots.
- No schema move of Service domain truth into Blueprint.

Those remain later M2 work once the contract proves itself through Service
Operation.
