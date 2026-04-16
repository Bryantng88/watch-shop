import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchSpecV2IncludeObjectSchema as WatchSpecV2IncludeObjectSchema } from './objects/WatchSpecV2Include.schema';
import { WatchSpecV2OrderByWithRelationInputObjectSchema as WatchSpecV2OrderByWithRelationInputObjectSchema } from './objects/WatchSpecV2OrderByWithRelationInput.schema';
import { WatchSpecV2WhereInputObjectSchema as WatchSpecV2WhereInputObjectSchema } from './objects/WatchSpecV2WhereInput.schema';
import { WatchSpecV2WhereUniqueInputObjectSchema as WatchSpecV2WhereUniqueInputObjectSchema } from './objects/WatchSpecV2WhereUniqueInput.schema';
import { WatchSpecV2ScalarFieldEnumSchema } from './enums/WatchSpecV2ScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchSpecV2FindFirstOrThrowSelectSchema: z.ZodType<Prisma.WatchSpecV2Select> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    brand: z.boolean().optional(),
    model: z.boolean().optional(),
    referenceNumber: z.boolean().optional(),
    nickname: z.boolean().optional(),
    caseShape: z.boolean().optional(),
    caseSizeMM: z.boolean().optional(),
    lugToLugMM: z.boolean().optional(),
    lugWidthMM: z.boolean().optional(),
    thicknessMM: z.boolean().optional(),
    materialProfile: z.boolean().optional(),
    primaryCaseMaterial: z.boolean().optional(),
    secondaryCaseMaterial: z.boolean().optional(),
    goldTreatment: z.boolean().optional(),
    goldColors: z.boolean().optional(),
    goldKarat: z.boolean().optional(),
    materialNote: z.boolean().optional(),
    dialColor: z.boolean().optional(),
    dialFinish: z.boolean().optional(),
    crystal: z.boolean().optional(),
    movementType: z.boolean().optional(),
    calibre: z.boolean().optional(),
    powerReserve: z.boolean().optional(),
    waterResistance: z.boolean().optional(),
    braceletType: z.boolean().optional(),
    strapMaterialText: z.boolean().optional(),
    buckleType: z.boolean().optional(),
    boxIncluded: z.boolean().optional(),
    bookletIncluded: z.boolean().optional(),
    cardIncluded: z.boolean().optional(),
    featuresJson: z.boolean().optional(),
    rawSpecJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2Select>;

export const WatchSpecV2FindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    brand: z.boolean().optional(),
    model: z.boolean().optional(),
    referenceNumber: z.boolean().optional(),
    nickname: z.boolean().optional(),
    caseShape: z.boolean().optional(),
    caseSizeMM: z.boolean().optional(),
    lugToLugMM: z.boolean().optional(),
    lugWidthMM: z.boolean().optional(),
    thicknessMM: z.boolean().optional(),
    materialProfile: z.boolean().optional(),
    primaryCaseMaterial: z.boolean().optional(),
    secondaryCaseMaterial: z.boolean().optional(),
    goldTreatment: z.boolean().optional(),
    goldColors: z.boolean().optional(),
    goldKarat: z.boolean().optional(),
    materialNote: z.boolean().optional(),
    dialColor: z.boolean().optional(),
    dialFinish: z.boolean().optional(),
    crystal: z.boolean().optional(),
    movementType: z.boolean().optional(),
    calibre: z.boolean().optional(),
    powerReserve: z.boolean().optional(),
    waterResistance: z.boolean().optional(),
    braceletType: z.boolean().optional(),
    strapMaterialText: z.boolean().optional(),
    buckleType: z.boolean().optional(),
    boxIncluded: z.boolean().optional(),
    bookletIncluded: z.boolean().optional(),
    cardIncluded: z.boolean().optional(),
    featuresJson: z.boolean().optional(),
    rawSpecJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict();

export const WatchSpecV2FindFirstOrThrowSchema: z.ZodType<Prisma.WatchSpecV2FindFirstOrThrowArgs> = z.object({ select: WatchSpecV2FindFirstOrThrowSelectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), orderBy: z.union([WatchSpecV2OrderByWithRelationInputObjectSchema, WatchSpecV2OrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecV2WhereInputObjectSchema.optional(), cursor: WatchSpecV2WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchSpecV2ScalarFieldEnumSchema, WatchSpecV2ScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchSpecV2FindFirstOrThrowArgs>;

export const WatchSpecV2FindFirstOrThrowZodSchema = z.object({ select: WatchSpecV2FindFirstOrThrowSelectSchema.optional(), include: WatchSpecV2IncludeObjectSchema.optional(), orderBy: z.union([WatchSpecV2OrderByWithRelationInputObjectSchema, WatchSpecV2OrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchSpecV2WhereInputObjectSchema.optional(), cursor: WatchSpecV2WhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchSpecV2ScalarFieldEnumSchema, WatchSpecV2ScalarFieldEnumSchema.array()]).optional() }).strict();