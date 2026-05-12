import { Prisma } from "@prisma/client";
import type { DB } from "@/server/db/client";
import { dbOrTx } from "@/server/db/client";
import type { UpsertWatchSpecInput } from "../shared";

function toDecimal(value?: number | string | null) {
  if (value == null || value === "") return null;
  return new Prisma.Decimal(value);
}

export async function upsertWatchSpecRepo(
  db: DB,
  input: UpsertWatchSpecInput
) {
  const client = dbOrTx(db);

  const watch = await client.watch.findUnique({
    where: { productId: input.productId },
    select: { id: true },
  });

  if (!watch) {
    throw new Error("Không tìm thấy watch để cập nhật spec");
  }

  return client.watchSpecV2.upsert({
    where: { watchId: watch.id },
    create: {
      watchId: watch.id,
      brand: input.brand ?? null,
      model: input.model ?? null,
      referenceNumber: input.referenceNumber ?? null,
      nickname: input.nickname ?? null,

      caseShape: input.caseShape ?? null,
      caseSizeMM: toDecimal(input.caseSizeMM),
      lugToLugMM: toDecimal(input.lugToLugMM),
      lugWidthMM: toDecimal(input.lugWidthMM),
      thicknessMM: toDecimal(input.thicknessMM),

      materialProfile: input.materialProfile ?? "SINGLE_MATERIAL",
      primaryCaseMaterial: input.primaryCaseMaterial ?? "STAINLESS_STEEL",
      secondaryCaseMaterial: input.secondaryCaseMaterial ?? null,
      goldTreatment: input.goldTreatment ?? null,
      goldColors: input.goldColors ?? [],
      goldKarat: input.goldKarat ?? null,
      materialNote: input.materialNote ?? null,

      dialColor: input.dialColor ?? null,
      dialFinish: input.dialFinish ?? null,
      crystal: input.crystal ?? null,
      movementType: input.movementType ?? null,
      calibre: input.calibre ?? null,
      powerReserve: input.powerReserve ?? null,
      waterResistance: input.waterResistance ?? null,
      braceletType: input.braceletType ?? null,
      strapMaterialText: input.strapMaterialText ?? null,
      buckleType: input.buckleType ?? null,

      bookletIncluded: input.bookletIncluded ?? false,
      cardIncluded: input.cardIncluded ?? false,

      featuresJson:
        (input.featuresJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
      rawSpecJson:
        (input.rawSpecJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
    },
    update: {
      ...(input.brand !== undefined ? { brand: input.brand } : {}),
      ...(input.model !== undefined ? { model: input.model } : {}),
      ...(input.referenceNumber !== undefined
        ? { referenceNumber: input.referenceNumber }
        : {}),
      ...(input.nickname !== undefined ? { nickname: input.nickname } : {}),

      ...(input.caseShape !== undefined ? { caseShape: input.caseShape } : {}),
      ...(input.caseSizeMM !== undefined
        ? { caseSizeMM: toDecimal(input.caseSizeMM) }
        : {}),
      ...(input.lugToLugMM !== undefined
        ? { lugToLugMM: toDecimal(input.lugToLugMM) }
        : {}),
      ...(input.lugWidthMM !== undefined
        ? { lugWidthMM: toDecimal(input.lugWidthMM) }
        : {}),
      ...(input.thicknessMM !== undefined
        ? { thicknessMM: toDecimal(input.thicknessMM) }
        : {}),

      ...(input.materialProfile !== undefined
        ? { materialProfile: input.materialProfile }
        : {}),
      ...(input.primaryCaseMaterial !== undefined
        ? { primaryCaseMaterial: input.primaryCaseMaterial }
        : {}),
      ...(input.secondaryCaseMaterial !== undefined
        ? { secondaryCaseMaterial: input.secondaryCaseMaterial }
        : {}),
      ...(input.goldTreatment !== undefined
        ? { goldTreatment: input.goldTreatment }
        : {}),
      ...(input.goldColors !== undefined ? { goldColors: input.goldColors } : {}),
      ...(input.goldKarat !== undefined ? { goldKarat: input.goldKarat } : {}),
      ...(input.materialNote !== undefined
        ? { materialNote: input.materialNote }
        : {}),

      ...(input.dialColor !== undefined ? { dialColor: input.dialColor } : {}),
      ...(input.dialFinish !== undefined
        ? { dialFinish: input.dialFinish }
        : {}),
      ...(input.crystal !== undefined ? { crystal: input.crystal } : {}),
      ...(input.movementType !== undefined
        ? { movementType: input.movementType }
        : {}),
      ...(input.calibre !== undefined ? { calibre: input.calibre } : {}),
      ...(input.powerReserve !== undefined
        ? { powerReserve: input.powerReserve }
        : {}),
      ...(input.waterResistance !== undefined
        ? { waterResistance: input.waterResistance }
        : {}),
      ...(input.braceletType !== undefined
        ? { braceletType: input.braceletType }
        : {}),
      ...(input.strapMaterialText !== undefined
        ? { strapMaterialText: input.strapMaterialText }
        : {}),
      ...(input.buckleType !== undefined
        ? { buckleType: input.buckleType }
        : {}),


      ...(input.bookletIncluded !== undefined
        ? { bookletIncluded: input.bookletIncluded }
        : {}),
      ...(input.cardIncluded !== undefined
        ? { cardIncluded: input.cardIncluded }
        : {}),

      ...(input.featuresJson !== undefined
        ? {
          featuresJson:
            (input.featuresJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        }
        : {}),
      ...(input.rawSpecJson !== undefined
        ? {
          rawSpecJson:
            (input.rawSpecJson as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        }
        : {}),
    },
  });
}