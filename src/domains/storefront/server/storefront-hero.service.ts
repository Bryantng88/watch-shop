import { prisma } from "@/server/db/client";
import { mediaStorage } from "@/domains/media/storage";

export async function getActiveStorefrontHero() {
  const hero = await prisma.storefrontHeroImage.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      storageKey: true,
      derivativeKey: true,
      altText: true,
      width: true,
      height: true,
      focalX: true,
      focalY: true,
      overlayOpacity: true,
    },
  });
  if (!hero) return null;
  const signed = await mediaStorage.sign(hero.derivativeKey || hero.storageKey, 600);
  return { ...hero, url: signed };
}
