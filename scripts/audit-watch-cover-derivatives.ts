import {
  MediaBindingLifecycle,
  MediaObjectAvailability,
  MediaOwnerType,
  MediaRole,
} from "@prisma/client";

import { cleanupRemovedWatchMedia } from "@/domains/media/application/watch-media-processing.service";
import { executeMediaDelete } from "@/domains/media/application/media-operation.service";
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
  const derivativeObjects = await prisma.mediaObject.findMany({
    where: {
      storageKey: { contains: "/derivatives/" },
      availability: { not: MediaObjectAvailability.DELETED },
      OR: [
        { storageKey: { contains: "/photoroom-" } },
        { storageKey: { contains: "/sharp-light-" } },
        { storageKey: { contains: "/cover-edit-" } },
        { storageKey: { contains: "/cover-sharp-" } },
        { storageKey: { contains: "/cover-cutout-" } },
      ],
    },
    select: { id: true, storageKey: true },
  });
  const orphanObjects = [];
  for (const object of derivativeObjects) {
    const [activeBindings, productImages, productReferences, children] = await Promise.all([
      prisma.mediaBinding.count({
        where: {
          mediaObjectId: object.id,
          lifecycle: { not: MediaBindingLifecycle.REMOVED },
        },
      }),
      prisma.productImage.count({ where: { fileKey: object.storageKey } }),
      prisma.product.count({
        where: {
          OR: [
            { storefrontImageKey: object.storageKey },
            { primaryImageUrl: object.storageKey },
          ],
        },
      }),
      prisma.mediaObject.count({
        where: {
          sourceMediaObjectId: object.id,
          availability: { not: MediaObjectAvailability.DELETED },
        },
      }),
    ]);
    if (!activeBindings && !productImages && !productReferences && !children) {
      orphanObjects.push(object);
    }
  }
  console.log(
    `[audit-watch-cover-derivatives] mode=${APPLY ? "apply" : "dry-run"} ` +
    `removed=${removed.length} staleDrafts=${staleDrafts.length} ` +
    `orphans=${orphanObjects.length} watches=${watchIds.length}`,
  );
  for (const binding of [...staleDrafts, ...removed]) {
    console.log(
      `watch=${binding.ownerId} role=${binding.role} lifecycle=${binding.lifecycle} ` +
      `object=${binding.mediaObjectId} key=${binding.mediaObject.storageKey}`,
    );
  }
  for (const object of orphanObjects) {
    console.log(`orphanObject=${object.id} key=${object.storageKey}`);
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
  for (const object of orphanObjects) {
    await executeMediaDelete({
      idempotencyKey: `media-cleanup:${object.id}`,
      mediaObjectId: object.id,
      storageKey: object.storageKey,
    });
    await prisma.mediaObject.update({
      where: { id: object.id },
      data: { availability: MediaObjectAvailability.DELETED, missingAt: new Date() },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
