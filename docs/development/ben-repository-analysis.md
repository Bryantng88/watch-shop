# Ben: read Git and clarify code requests (steps 1–2)

Based on deployed PR48 (08eb17fb). This is an independent opt-in read-only adapter
for the existing chat worker protocol. It does not reuse the personal-work worker's
write credential or relax the CLI sandbox. Codex gets no GitHub credential, local
checkout, Git CLI, shell, direct HTTP or write API. Parent worker requests the
existing internal lookup API; the admin server performs fixed GitHub GETs.

## Activation, staging only

Existing customer assistant readiness/authentication still applies. The operator
must configure these **admin app** bindings privately, never in chat or Git:

- BEN_REPOSITORY_READ_ENABLED=1 (default off).
- CUSTOMER_AI_PERMISSION_CONTACT_USER_ID: the existing verified Long account.
  That account must remain active and ADMIN. Names/claimed identity and other
  admins do not grant repository access.
- BEN_REPOSITORY_COMMIT: exact 40-character lowercase SHA selected by the operator.
  Choose the source actually intended for review; compare deployed app/worker and
  unmerged PR/local changes first. No silent main/staging/branch inference.
- BEN_GITHUB_READ_TOKEN: a dedicated fine-grained credential scoped only to
  Bryantng88/watch-shop, Contents read and Pull requests read (metadata read).
  No Contents write, PR write, Actions/workflow administration or deployment rights.
  Bind it only in the app secret environment. Do not copy GH_TOKEN from the coding
  worker, print it, or pass it to the model/worker subprocess.

Deploy app AND updated customer worker/schema together. No migration. Preserve
existing flags, OAuth/Calendar, worker mounts/security, ingress and storefront.
This task does not deploy, provision the credential or modify production.

## Available reads and source identity

- repository.info: operator-selected commit, tree and commit subject.
- repository.tree(query): bounded directory listing; empty string means root.
- repository.file(query): exact allowed path, optionally :start-end (max 160 lines,
  16,000 returned characters; text blobs up to 80KB, no symlinks/submodules).
- repository.history: ten ancestor commits of the pinned snapshot.
- repository.pullRequests: fifteen current open PR titles/head/base SHAs. PR heads
  are separate refs, not proof that their code is in the pinned snapshot.

Reads use immutable Git tree/blob SHAs and a fixed GitHub origin/repository. The
first repository read pins the conversation snapshot; later configured SHAs do not
silently retarget it. Start a new conversation to review a newly configured SHA.
Timeouts, response sizes, lookup counts, extensions and path roots are bounded.
Environment/key/deployment/generated paths and detected literal credentials or
private-key contents fail closed. Only source/design/development/test paths and
selected root configuration files are exposed. Omitted files mean unavailable,
not absent from Git. No default-branch code search pretends to match a release.

## Conversation behavior

Long can ask “Ben đọc code phần list TI, làm rõ cách nhớ bộ lọc sau khi tải lại”.
Ben inspects relevant files, separates observed facts from hypotheses, then states
problem, intended behavior, proposed scope, meaningful checks and one missing fact
if needed. UI displays actual read provenance (SHA, files/line ranges) and says
analysis only. No model assertion counts as executed work or a passing test.

Repository evidence cannot create a work/order/support review or navigation in
the same turn. Existing business writes remain separate. There is no approve-code
button, code job, branch, edit, test execution, push, PR creation, merge or deploy.
A user may later discuss normal business work; those existing guards still apply.

Code-derived replies are tagged. Claim/history/finish recheck verified Long and
configuration; disabling access redacts saved code replies and sources, including
follow-up replies that inherited code context. Server-owned history is retained.
No code content/credentials are written to operational logs.

## Acceptance and rollout limits

Automated tests use synthetic GitHub responses and a separate loopback database.
They cover identity, fixed GET-only transport, pinning, paths/symlinks/content/range
bounds, PR/history projection, failed reads, permission revocation/redaction and
zero business writes. Real private GitHub/credential validation and real Codex
analysis acceptance require configured staging; no claim of that acceptance here.

After activation: verify info SHA against the chosen source, inspect a known file
and line range, ask a concrete change request and one clarification, check another
admin/same-name user cannot read, revoke the flag mid-run and check history redacts.
Confirm no branch/PR/order/task is created. Disable only the repository flag to
roll back; do not remove conversation history or affect existing worker features.
