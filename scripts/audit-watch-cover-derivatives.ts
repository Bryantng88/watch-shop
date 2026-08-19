import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { cleanupRemovedWatchMedia } from "@/domains/media/application/watch-media-processing.service";
import { prisma } from "@/server/db/client";

const APPLY = process.argv.includes("--apply");
const COVER_ROLES = [MediaRole.COVER, MediaRole.THUMBNAIL];

async function main() {
  const bindings = await prisma.mediaBinding.findMany({
    where: {
      ownerType: MediaOwnerType.WATCH,
      role: { in: COVER_ROLES },
      mediaObject: {
        storageKey: { contains: "/derivatives/" },
        availability: { not: MediaObjectAvailability.DELETED },
      },
    },
    include: { mediaObject: { select: { id: true, storageKey: true } } },
    orderBy: [{ ownerId: "asc" }, { role: "asc" }, { updatedAt: "desc" }],
  });

  const activeDraftBySlot = new Set<string>();
  const staleDrafts = [];
  const removed = [];
  for (const binding of bindings) {
    if (binding.lifecycle === MediaBindingLifecycle.REMOVED) {
      removed.push(binding);
      continue;
    }
    if (binding.lifecycle !== MediaBindingLifecycle.DRAFT) continue;
    const slot = `${binding.ownerId}:${binding.role}`;
    if (activeDraftBySlot.has(slot)) staleDrafts.push(binding);
    else activeDraftBySlot.add(slot);
  }

  const watchIds = [...new Set([...staleDrafts, ...removed].map((item) => item.ownerId))];
  console.log(
    `[audit-watch-cover-derivatives] mode=${APPLY ? "apply" : "dry-run"} ` +
    `removed=${removed.length} staleDrafts=${staleDrafts.length} watches=${watchIds.length}`,
  );
  for (const binding of [...staleDrafts, ...removed]) {
    console.log(
      `watch=${binding.ownerId} role=${binding.role} lifecycle=${binding.lifecycle} ` +
      `object=${binding.mediaObjectId} key=${binding.mediaObject.storageKey}`,
    );
  }

  if (!APPLY) return;
  if (staleDrafts.length) {
    await prisma.mediaBinding.updateMany({
      where: { id: { in: staleDrafts.map((item) => item.id) } },
      data: { lifecycle: MediaBindingLifecycle.REMOVED },
    });
  }
  for (const watchId of watchIds) {
    await cleanupRemovedWatchMedia({ watchId, roles: COVER_ROLES });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
