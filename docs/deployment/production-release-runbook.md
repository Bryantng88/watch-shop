# Production release runbook

Production must be reproducible from Git. A NAS release directory is an artifact, never a source of truth.

## Required release gates

1. All intended changes are committed on `main`.
2. `main` exactly matches `origin/main`.
3. The working tree is clean.
4. Lint, TypeScript, focused tests, and a production build pass.
5. The commit has an annotated `production-*` tag.
6. The release archive is created with `git archive` from that exact commit.
7. The deployed container image is named `watch-shop:release-<short-sha>`.

The deployment script enforces gates 1–3 and 5–7:

```powershell
./scripts/deploy-production.ps1
```

Each NAS release stores:

- `RELEASE_COMMIT`: the full Git SHA;
- `RELEASE_TAG`: the production tag;
- `PREVIOUS_IMAGE`: the image that was running immediately before deployment.

## Verification

- Container `watch-shop-app-1` must report `healthy`.
- Confirm its image equals the release SHA.
- Smoke-test `/products`, menu destinations, one product detail, admin login, and the changed workflow.
- Record the tag, commit, image, checks run, and visible behavior in the release handoff.

## Rollback

Read `PREVIOUS_IMAGE` from the failed release directory and recreate only the app service with that image tag. Do not change the database unless the release contained a reviewed migration and its rollback was planned separately.

Never build production from uncommitted files, a manually edited NAS directory, a stash, or an unmerged release branch.
