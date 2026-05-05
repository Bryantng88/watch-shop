import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchIncludeObjectSchema as WatchIncludeObjectSchema } from './objects/WatchInclude.schema';
import { WatchOrderByWithRelationInputObjectSchema as WatchOrderByWithRelationInputObjectSchema } from './objects/WatchOrderByWithRelationInput.schema';
import { WatchWhereInputObjectSchema as WatchWhereInputObjectSchema } from './objects/WatchWhereInput.schema';
import { WatchWhereUniqueInputObjectSchema as WatchWhereUniqueInputObjectSchema } from './objects/WatchWhereUniqueInput.schema';
import { WatchScalarFieldEnumSchema } from './enums/WatchScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchFindManySelectSchema: z.ZodType<Prisma.WatchSelect> = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    legacyVariantId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    stockState: z.boolean().optional(),
    saleState: z.boolean().optional(),
    serviceState: z.boolean().optional(),
    siteChannel: z.boolean().optional(),
    gender: z.boolean().optional(),
    conditionGrade: z.boolean().optional(),
    movementType: z.boolean().optional(),
    movementCalibre: z.boolean().optional(),
    serialNumber: z.boolean().optional(),
    yearText: z.boolean().optional(),
    style: z.boolean().optional(),
    hasBox: z.boolean().optional(),
    hasPapers: z.boolean().optional(),
    specStatus: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional(),
    watchContent: z.boolean().optional(),
    watchPrice: z.boolean().optional(),
    watchSpecV2: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchSelect>;

export const WatchFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    productId: z.boolean().optional(),
    legacyVariantId: z.boolean().optional(),
    acquisitionId: z.boolean().optional(),
    stockState: z.boolean().optional(),
    saleState: z.boolean().optional(),
    serviceState: z.boolean().optional(),
    siteChannel: z.boolean().optional(),
    gender: z.boolean().optional(),
    conditionGrade: z.boolean().optional(),
    movementType: z.boolean().optional(),
    movementCalibre: z.boolean().optional(),
    serialNumber: z.boolean().optional(),
    yearText: z.boolean().optional(),
    style: z.boolean().optional(),
    hasBox: z.boolean().optional(),
    hasPapers: z.boolean().optional(),
    specStatus: z.boolean().optional(),
    notes: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    product: z.boolean().optional(),
    watchContent: z.boolean().optional(),
    watchPrice: z.boolean().optional(),
    watchSpecV2: z.boolean().optional()
  }).strict();

export const WatchFindManySchema: z.ZodType<Prisma.WatchFindManyArgs> = z.object({ select: WatchFindManySelectSchema.optional(), include: WatchIncludeObjectSchema.optional(), orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchScalarFieldEnumSchema, WatchScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchFindManyArgs>;

export const WatchFindManyZodSchema = z.object({ select: WatchFindManySelectSchema.optional(), include: WatchIncludeObjectSchema.optional(), orderBy: z.union([WatchOrderByWithRelationInputObjectSchema, WatchOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchWhereInputObjectSchema.optional(), cursor: WatchWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchScalarFieldEnumSchema, WatchScalarFieldEnumSchema.array()]).optional() }).strict();