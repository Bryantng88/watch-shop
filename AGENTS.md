# Watch Shop agent instructions

These instructions apply to the entire repository. Follow them in Codex Cloud,
the Codex desktop app, the CLI, and IDE integrations.

## Working agreement

- Work on a dedicated branch and submit changes through a pull request.
- Do not commit or push directly to `main`.
- Preserve unrelated user changes and generated files already present in the
  working tree. Stage only files that belong to the current task.
- Never discard, reset, overwrite, or clean user work unless the user explicitly
  requests that exact operation.
- Keep credentials out of source, logs, prompts, comments, screenshots, and
  commits. This includes `.env.production`, `.env.build`, API tokens, GitHub
  registration tokens, SSH keys, database URLs, and NAS credentials.
- Use repository files and scripts as the source of truth. Ask before changing
  architecture, production data, deployment policy, or access controls.

## Verification

Run checks appropriate to the files changed. The normal application checks are:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

Run relevant domain checks and smoke scripts from `package.json` when a change
touches their behavior. Report commands that could not run and the reason. Do
not claim a check passed unless it completed successfully.

## Git and pull requests

- Refresh remote refs before preparing a pull request.
- Keep commits scoped and describe verification in the pull request.
- A pull request should target `main` unless the user specifies another base.
- Merging a pull request does not authorize a production deployment.
- Do not merge, enable auto-merge, or delete a remote branch unless the user
  explicitly asks for that action.

## Production authorization

- Never deploy production based only on a coding request, completed PR, merge,
  release suggestion, or successful test run.
- Never create, move, or push a `production-*` tag without explicit user
  authorization for the exact release commit.
- Before creating a production tag, verify that the intended commit is the
  current `origin/main` commit and that all required checks have passed.
- Use an annotated tag named `production-YYYYMMDD-description`.
- Pushing a `production-*` tag starts the GitHub Actions production workflow.
- GitHub Environment approval must be performed by the user. Codex must not
  approve or bypass the production protection rule.
- Do not weaken branch protection, Environment reviewers, workflow permissions,
  runner labels, secret handling, backup steps, health checks, or rollback
  behavior to make a deployment pass.

## NAS deployment

Production deployment is performed only by
`.github/workflows/deploy-production.yml` on the dedicated self-hosted runner
with labels `self-hosted`, `linux`, and `watch-shop-production`.

The expected release sequence is:

1. Develop and verify the change on a dedicated branch.
2. Open a pull request to `main` and let the user review it.
3. After merge, refresh `origin/main` and verify the exact release commit.
4. Ask for explicit authorization to create and push the production tag.
5. Push the annotated `production-*` tag.
6. Stop and let the user approve the `production` Environment deployment.
7. The NAS runner backs up the database, builds images, applies migrations,
   rebuilds the Watch List projection, starts the app, and checks health.

Database migrations are forward-only and are not automatically reversed when
the application image rolls back. Keep production migrations backward
compatible with the previously deployed application.

Do not SSH into the NAS or run Docker commands against production unless the
user explicitly requests production infrastructure work. Never print the
contents of production environment files.

See `docs/deployment/github-actions-nas-runner.md` for runner setup, security,
release operation, and emergency controls.

## Codex Cloud

- Codex Cloud works from repository state available through GitHub; it cannot
  see uncommitted files that exist only on another computer.
- Keep reusable project setup in the Cloud environment and durable repository
  instructions in this file.
- For ordinary Cloud coding tasks, stop after verification and pull-request
  preparation unless the user separately authorizes merge or release actions.
