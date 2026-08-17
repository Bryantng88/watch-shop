import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StorefrontHeroImageOrderByWithRelationInputObjectSchema as StorefrontHeroImageOrderByWithRelationInputObjectSchema } from './objects/StorefrontHeroImageOrderByWithRelationInput.schema';
import { StorefrontHeroImageWhereInputObjectSchema as StorefrontHeroImageWhereInputObjectSchema } from './objects/StorefrontHeroImageWhereInput.schema';
import { StorefrontHeroImageWhereUniqueInputObjectSchema as StorefrontHeroImageWhereUniqueInputObjectSchema } from './objects/StorefrontHeroImageWhereUniqueInput.schema';
import { StorefrontHeroImageScalarFieldEnumSchema } from './enums/StorefrontHeroImageScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StorefrontHeroImageFindFirstSelectSchema: z.ZodType<Prisma.StorefrontHeroImageSelect> = z.object({
    id: z.boolean().optional(),
    storageKey: z.boolean().optional(),
    derivativeKey: z.boolean().optional(),
    originalFileName: z.boolean().optional(),
    altText: z.boolean().optional(),
    mimeType: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    focalX: z.boolean().optional(),
    focalY: z.boolean().optional(),
    overlayOpacity: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageSelect>;

export const StorefrontHeroImageFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    storageKey: z.boolean().optional(),
    derivativeKey: z.boolean().optional(),
    originalFileName: z.boolean().optional(),
    altText: z.boolean().optional(),
    mimeType: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    focalX: z.boolean().optional(),
    focalY: z.boolean().optional(),
    overlayOpacity: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const StorefrontHeroImageFindFirstSchema: z.ZodType<Prisma.StorefrontHeroImageFindFirstArgs> = z.object({ select: StorefrontHeroImageFindFirstSelectSchema.optional(),  orderBy: z.union([StorefrontHeroImageOrderByWithRelationInputObjectSchema, StorefrontHeroImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: StorefrontHeroImageWhereInputObjectSchema.optional(), cursor: StorefrontHeroImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StorefrontHeroImageScalarFieldEnumSchema, StorefrontHeroImageScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.StorefrontHeroImageFindFirstArgs>;

export const StorefrontHeroImageFindFirstZodSchema = z.object({ select: StorefrontHeroImageFindFirstSelectSchema.optional(),  orderBy: z.union([StorefrontHeroImageOrderByWithRelationInputObjectSchema, StorefrontHeroImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: StorefrontHeroImageWhereInputObjectSchema.optional(), cursor: StorefrontHeroImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StorefrontHeroImageScalarFieldEnumSchema, StorefrontHeroImageScalarFieldEnumSchema.array()]).optional() }).strict();