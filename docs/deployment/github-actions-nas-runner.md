# GitHub Actions production runner on QNAP NAS

This repository deploys production only from a `production-*` tag that points
to the current `main` commit. The GitHub-hosted control plane dispatches the job,
but all production commands run locally on the NAS through a self-hosted runner.

## Security model

- Use a dedicated, non-admin NAS account for the runner.
- Give that account access only to the runner directory, `/share/WatchShop`, and
  the Container Station Docker command required by this deployment.
- Do not put `.env.production`, `.env.build`, SSH keys, or NAS passwords in the
  repository or GitHub Actions secrets. They remain on the NAS.
- Do not attach the `watch-shop-production` label to a general-purpose runner.
- Do not run untrusted pull-request workflows on this production runner.
- Configure the GitHub `production` Environment with required reviewers so a tag
  cannot deploy until an authorized person approves it.

## 1. Prepare NAS directories

Create these directories as the dedicated runner account:

```text
/share/WatchShop/app
/share/WatchShop/releases
/share/WatchShop/backups/database
```

Keep the existing production files here:

```text
/share/WatchShop/app/.env.production
/share/WatchShop/app/.env.build
```

Ensure `.env.production` defines `DB_BACKUP_DIR` as
`/share/WatchShop/backups/database` (or another persistent NAS path). Restrict
both environment files so only the deployment account can read them.

The default Docker executable is:

```text
/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker
```

If the NAS uses a different path, set the repository variable
`WATCHSHOP_DOCKER_BIN` to the correct absolute path.

## 2. Build the runner container

QNAP's host libraries can be older than the minimum required by the official
GitHub runner. This NAS therefore runs the official runner binaries inside the
repository's Ubuntu-based image instead of executing them directly on the host.
The image contains system compatibility packages and the Docker client; the
runner archive still comes directly from GitHub and must have its published
SHA-256 verified. The client reaches the NAS Docker daemon through its socket.

Build `ops/deployment/nas-runner.Dockerfile` on the NAS as
`watch-shop-actions-runner:local`. The container needs these mounts:

```text
/share/WatchShop/actions-runner -> /runner
/share -> /share
/var/run/docker.sock -> /var/run/docker.sock
```

Run it as the dedicated runner account's numeric UID/GID and add the numeric
group that owns `/var/run/docker.sock`. Do not run it as a privileged container.

## 3. Register a dedicated runner

In GitHub, open the repository and go to **Settings > Actions > Runners > New
self-hosted runner**. Select Linux and the NAS CPU architecture, then run the
exact download and configuration commands GitHub displays while signed in as
the dedicated NAS account.

Run `config.sh` once inside the runner image with the short-lived registration
token supplied by GitHub. During configuration:

- give the runner a recognizable name such as `watch-shop-nas-production`;
- add the custom label `watch-shop-production`;
- use a dedicated runner work directory;
- keep the runner work directory inside `/runner` so it persists on the NAS;
- configure Container Station to restart the runner container automatically.

Registration tokens are short-lived. Generate one from GitHub only when the NAS
is ready. Never paste the token into source files or chat.

## 4. Configure GitHub production protection

Create an Environment named `production` under **Settings > Environments** and:

1. Add the owner as a required reviewer.
2. Disable self-review when that option is available.
3. Restrict deployment branches and tags to protected production tags as
   supported by the repository plan.

Add these optional repository variables under **Settings > Secrets and
variables > Actions > Variables** only when the defaults do not match the NAS:

| Variable | Default |
| --- | --- |
| `WATCHSHOP_CONFIG_DIR` | `/share/WatchShop/app` |
| `WATCHSHOP_RELEASE_ROOT` | `/share/WatchShop/releases` |
| `WATCHSHOP_DOCKER_BIN` | `/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker` |
| `WATCHSHOP_KEEP_RELEASES` | `5` |

These values are paths, not credentials.

## 5. Validate before the first deployment

From an interactive shell running as the runner account, verify:

```bash
test -r /share/WatchShop/app/.env.production
test -r /share/WatchShop/app/.env.build
/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker version
/share/CACHEDEV1_DATA/.qpkg/container-station/bin/docker compose version
```

The workflow also requires GNU `bash`, `git`, `tar`, `find`, `sort`, `tail`,
`cut`, and `mktemp` on the runner host.

## 6. Release

Make sure the intended commit is the current `origin/main`, then create and push
an annotated production tag:

```bash
git tag -a production-YYYYMMDD-description -m "Production: description"
git push origin production-YYYYMMDD-description
```

GitHub queues the production job and waits for Environment approval. After
approval, the NAS runner:

1. verifies the tag points to the current `origin/main`;
2. creates an immutable release directory;
3. builds the app and operations images;
4. backs up the database;
5. applies Prisma migrations and refreshes the Watch List projection;
6. starts the application and waits for Docker health checks;
7. restores the previous application image if health checks fail;
8. retains the newest configured number of release directories.

Database migrations are forward-only and are not automatically reversed by an
application rollback. Production migrations must therefore remain backward
compatible with the previously deployed application image.

## Emergency controls

- Stop the runner service to prevent new deployments immediately.
- Cancel a queued or running workflow in the GitHub Actions UI.
- Do not delete the current and previous Docker images until the release has
  been verified.
- Review the Actions log and the release metadata files `RELEASE_TAG`,
  `RELEASE_COMMIT`, and `PREVIOUS_IMAGE` when diagnosing a failed deployment.
