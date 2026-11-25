# Work image attachments: audit, storage and lifecycle

Scope: Quản lý công việc (Personal Work TaskItems) and individual checklist entries, including entry-only shares. These are work evidence/reference images, not Watch gallery assets and not a Media Production stage. Operation tasks do not gain new upload/edit privileges in this change. The reusable attachment component/API is separate from Watch Media processing.

## Existing flow and reuse

| Existing piece | Current role | Reuse for work |
| --- | --- | --- |
| MediaStorage / S3MediaStorage | NAS/S3-compatible object read/write/stat/delete | Same bucket, credentials and verified I/O; no new storage service |
| MediaObject | Stable physical identity, metadata/checksum/availability | Same record model for each image |
| MediaBinding | Owner + role + lifecycle | Add TASK_ITEM / TASK_CHECKLIST enum values only; no new tables. GALLERY belongs to the work owner, neutral UNISEX metadata and no Watch pipeline |
| MediaOperation | Durable operation/idempotency journal | INGEST receipt for upload/retry, DELETE journal for eventual cleanup |
| MediaPathPolicy | Sole key creation policy | workOriginal UUID path under `media/work/objects/<uuid>/original/image.webp` |
| Sharp / renderNasMediaThumbnail | Existing normalization/thumbnail codec | JPEG/PNG/WebP validation, orientation, bounded WebP and owner-checked transient thumbnails |
| Personal Work access helpers | Parent owner/editor/viewer + checklist-only share policy | Reuse on list, upload, byte read and remove, including a final check after storage write |
| Generic Media browser / sign / thumbnail / Watch ingestion | Product/source-media management | Do not reuse these as authorization gateways: their read permission is broader than a private work share |

Watch ingestion currently registers or moves source files into canonical objects, binds owners, derives selected images and handles review/publication. Editorial posts have their own ownership and paths. Website uploads use storefront prefixes. Work images must not be registered into those pools, inherit Watch approval/publication or move between Men/Women stages. Existing generic sign/raw GET and thumbnail paths would otherwise bypass work ownership. The implementation blocks the work prefix at those gateways and prevents a private work object being rebound to a public/product owner.

## Storage choice

Use the current NAS/S3 bucket and a dedicated private prefix. Keys contain a generated MediaObject UUID, not user filenames or workflow status. Owner identity/access lives in MediaBinding. Completing, rescheduling, sharing or canceling work never moves bytes. No new bucket, NAS credential, external image processor, Drive integration or public URL is required.

Accept static JPEG/PNG/WebP, up to 10 MiB input. Bound multipart bodies even without Content-Length; validate decoded content rather than trusting MIME alone. Sharp applies orientation, strips EXIF/GPS, limits decoded pixels to 50M and fits within 2048×2048, WebP quality 85, max 5 MiB output. The stored business original is this normalized image; raw camera/EXIF bytes are not retained. This is a deliberate compact reference-image policy, not archival storage of untouched original files. Thumbnails reuse the renderer only, without writing to the generic NAS-browser cache or entering the Next image optimizer.

## Lifecycle

| Stage | Durable state | Behavior |
| --- | --- | --- |
| Choose file | Browser only | No server object before explicit upload; work/entry must already exist |
| Reserve | MediaObject UNVERIFIED + DRAFT binding + INGEST PENDING | Owner-scoped lock reserves a slot; max 20 images including pending slots |
| Write/verify | INGEST RUNNING | NAS write, stat/size/ETag verification |
| Attach | AVAILABLE + ATTACHED + INGEST SUCCEEDED | Recheck edit/share/closed state in transaction; one activity entry |
| Retry | Same client upload UUID, owner, actor and normalized checksum | Reuse receipt/object/binding; reject changed bytes or removed receipt; no duplicate attachments |
| Write/final authorization failure | UNVERIFIED/DRAFT + INGEST FAILED | Never serve bytes; owner sees pending/failed state and may retry or remove |
| Complete/cancel work | Keep attachment | Read-only history; image upload does not complete work or change checklist progress |
| Remove image | Binding REMOVED | Owner/editor in an open work scope can remove; byte endpoint rejects immediately. No immediate physical delete |
| Owner/checklist disappears or stale draft | Maintenance retires binding | Missing owner or >24h stale draft with no recent upload; retention clock starts at retirement |
| Purge | Verified DELETE journal, object DELETED | At least 30 days after object creation and every removed binding's last update, with no active binding, derivative, product reference or recent upload |

`npx tsx scripts/work-media-retention.ts` is dry-run by default. `--apply` is an explicit authorized maintenance action, not an automatic scheduler and not run by this coding task. It uses the existing verified-delete operation. Attached images of completed/canceled but existing work are retained. Retention is a minimum grace period, not a scheduled purge guarantee; backup/recovery remains subject to existing NAS operations. Deleted bytes are not restored by reattaching an old upload receipt.

## Authorization and serving

The API is under `/api/admin/personal-work/images`, within the existing Personal Work namespace. Require authenticated TASK_VIEW then the current parent or checklist owner/share policy. Root work images are invisible to entry-only recipients; entry images use only that entry's parent/share permission. Parent editor or entry editor can attach/remove in its own scope; viewers only read. Admin role does not override another person's private-work share policy. Closed/locked work remains viewable but cannot accept/remove images until reopened through the existing workflow.

The client receives binding IDs and relative owner-checked byte URLs, never a NAS key, bucket or reusable presigned URL. Every GET/thumbnail/HEAD path reauthorizes; responses are private/no-store with same-origin resource policy. Share revocation blocks future requests and refresh drops the visible thumbnails. Previously downloaded bytes cannot be recalled. The reusable UI refreshes on focus/visibility return, handles stale target responses, retains upload IDs/files for retry, and confirms removal. Upload saves immediately independent of unsaved text fields; the UI states this explicitly.

The whole-work component is absent from checklist-only projections. Checklist galleries are lazy to avoid one request per entry on initial display. Completed/canceled work, no edit rights, missing data, pending uploads and failures are distinct states. Use shared AdminButton and WorkAttachmentIcon (Paperclip). No status progression, automatic image review or Watch publication is triggered.

## Migration and verification

The only database migration adds TASK_ITEM and TASK_CHECKLIST to MediaOwnerType. Deploy migration and regenerate Prisma Client before enabling the new API/UI; do not alter existing owner data. No schema migration or storage command was executed against staging/production during implementation.

Verification covers actual codec normalization/spoof/size limits, private-key protection, retention references/age, bounded multipart reads, existing media binding/ingestion/delete regressions, owner/editor/viewer and entry-only isolation, share revocation during upload/read, idempotency/concurrency, NAS failure/retry, closed-work race, quota, detach-without-delete and actual UI upload/retry/remove/mobile behavior. The PostgreSQL CI fixture uses an isolated test database and in-memory storage, not NAS. CI requires no production credentials. Full live NAS/deployment validation is separate.
