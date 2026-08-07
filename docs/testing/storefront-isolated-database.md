# Storefront Isolated Database Gate

The integration suite must never run against the application database. It
requires `STOREFRONT_TEST_DATABASE_URL` and applies several independent public
Purchase Requests against synthetic Watches. Purchase Requests do not reserve
or HOLD inventory before qualification.

## Safety Guards

The runner refuses to start when:

- the test URL is missing;
- it equals `DATABASE_URL` or `DIRECT_URL`;
- the database name does not contain `test` or `storefront`;
- the host is not loopback unless `ALLOW_REMOTE_STOREFRONT_TEST_DB=1` is
  explicitly set;
- the storefront ingress columns are absent from the test schema.

All synthetic ids use an `sf-it-*` prefix and are removed in `finally`. Use a
disposable database anyway; cleanup is not a substitute for isolation.

## Local PostgreSQL/Docker Example

Create a dedicated disposable database such as `watch_shop_storefront_test`,
then in a new PowerShell session bootstrap it from the current Prisma schema:

```powershell
$env:STOREFRONT_TEST_DATABASE_URL='postgresql://USER:PASSWORD@127.0.0.1:5433/watch_shop_storefront_test'
$env:DATABASE_URL=$env:STOREFRONT_TEST_DATABASE_URL
$env:DIRECT_URL=$env:STOREFRONT_TEST_DATABASE_URL
npx prisma db push --force-reset --skip-generate
Remove-Item Env:DATABASE_URL
Remove-Item Env:DIRECT_URL
npm run storefront:test-db
```

`--force-reset` is authorized only for this verified disposable database. The
repository's historical migration chain contains intentionally empty legacy
baselines and cannot currently bootstrap a blank database: migration
`20260701_task_item_activity_v1` references `TaskItem` before that table exists.
Do not rewrite already-deployed migrations to work around this. Continue to use
`prisma migrate deploy` for established environments whose migration history is
already baselined, including production.

Do not load a production dump. The suite creates the minimum synthetic Watch
fixtures it needs.

For a remote disposable database, verify the project/database identity first,
then set `ALLOW_REMOTE_STOREFRONT_TEST_DB=1` only for that test process.

## Assertions

- first submission creates one waiting Purchase Request and no Order;
- identical retry returns the same Purchase Request;
- changed body on the same key conflicts;
- two distinct requests for one Watch are both accepted without reserving it;
- the sixth request from one fingerprint inside ten minutes is rejected;
- first Zalo lookup event completes, identical event replays its stored result,
  and changed payload hash conflicts;
- synthetic Purchase Requests, receipts and products are cleaned up.

Run `npm run storefront:verify` and `npm run build` again after the database gate.

For browser acceptance, `npm run storefront:seed-acceptance` creates six
guarded synthetic Watches in the same loopback test database. It removes prior
fixture Orders before rebuilding the products, so reruns restore Watches from
HOLD to an orderable state. Pass `-- --cleanup` to remove the fixtures. The
companion `npm run storefront:seed-acceptance-media` command requires a
loopback `S3_ENDPOINT` and a bucket name containing `test`; it generates six
local-only PNG images and cannot target the production storage endpoint under
these guards.
