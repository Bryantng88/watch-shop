import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MediaLegacyManifestOrderByWithRelationInputObjectSchema as MediaLegacyManifestOrderByWithRelationInputObjectSchema } from './objects/MediaLegacyManifestOrderByWithRelationInput.schema';
import { MediaLegacyManifestWhereInputObjectSchema as MediaLegacyManifestWhereInputObjectSchema } from './objects/MediaLegacyManifestWhereInput.schema';
import { MediaLegacyManifestWhereUniqueInputObjectSchema as MediaLegacyManifestWhereUniqueInputObjectSchema } from './objects/MediaLegacyManifestWhereUniqueInput.schema';
import { MediaLegacyManifestScalarFieldEnumSchema } from './enums/MediaLegacyManifestScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MediaLegacyManifestFindFirstOrThrowSelectSchema: z.ZodType<Prisma.MediaLegacyManifestSelect> = z.object({
    id: z.boolean().optional(),
    legacyMediaAssetId: z.boolean().optional(),
    legacyKey: z.boolean().optional(),
    classification: z.boolean().optional(),
    decision: z.boolean().optional(),
    physicalExists: z.boolean().optional(),
    productImageId: z.boolean().optional(),
    productId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    movedFromKey: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    note: z.boolean().optional(),
    scannedAt: z.boolean().optional(),
    migratedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestSelect>;

export const MediaLegacyManifestFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    legacyMediaAssetId: z.boolean().optional(),
    legacyKey: z.boolean().optional(),
    classification: z.boolean().optional(),
    decision: z.boolean().optional(),
    physicalExists: z.boolean().optional(),
    productImageId: z.boolean().optional(),
    productId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    movedFromKey: z.boolean().optional(),
    mediaObjectId: z.boolean().optional(),
    note: z.boolean().optional(),
    scannedAt: z.boolean().optional(),
    migratedAt: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const MediaLegacyManifestFindFirstOrThrowSchema: z.ZodType<Prisma.MediaLegacyManifestFindFirstOrThrowArgs> = z.object({ select: MediaLegacyManifestFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([MediaLegacyManifestOrderByWithRelationInputObjectSchema, MediaLegacyManifestOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaLegacyManifestWhereInputObjectSchema.optional(), cursor: MediaLegacyManifestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaLegacyManifestScalarFieldEnumSchema, MediaLegacyManifestScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MediaLegacyManifestFindFirstOrThrowArgs>;

export const MediaLegacyManifestFindFirstOrThrowZodSchema = z.object({ select: MediaLegacyManifestFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([MediaLegacyManifestOrderByWithRelationInputObjectSchema, MediaLegacyManifestOrderByWithRelationInputObjectSchema.array()]).optional(), where: MediaLegacyManifestWhereInputObjectSchema.optional(), cursor: MediaLegacyManifestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MediaLegacyManifestScalarFieldEnumSchema, MediaLegacyManifestScalarFieldEnumSchema.array()]).optional() }).strict();