import { prisma } from "@/server/db/client";

export async function getActiveStorefrontHero() {
  const hero = await prisma.storefrontHeroImage.findFirst({
    where: { isActive: true },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      altText: true,
      width: true,
      height: true,
      focalX: true,
      focalY: true,
      overlayOpacity: true,
    },
  });
  return hero ? { ...hero, url: "/api/public/storefront/catalog-hero" } : null;
}
