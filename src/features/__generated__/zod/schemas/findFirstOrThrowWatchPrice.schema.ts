import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchPriceIncludeObjectSchema as WatchPriceIncludeObjectSchema } from './objects/WatchPriceInclude.schema';
import { WatchPriceOrderByWithRelationInputObjectSchema as WatchPriceOrderByWithRelationInputObjectSchema } from './objects/WatchPriceOrderByWithRelationInput.schema';
import { WatchPriceWhereInputObjectSchema as WatchPriceWhereInputObjectSchema } from './objects/WatchPriceWhereInput.schema';
import { WatchPriceWhereUniqueInputObjectSchema as WatchPriceWhereUniqueInputObjectSchema } from './objects/WatchPriceWhereUniqueInput.schema';
import { WatchPriceScalarFieldEnumSchema } from './enums/WatchPriceScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchPriceFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WatchPriceSelect> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    costPrice: z.boolean().optional(),
    serviceCost: z.boolean().optional(),
    landedCost: z.boolean().optional(),
    listPrice: z.boolean().optional(),
    salePrice: z.boolean().optional(),
    minPrice: z.boolean().optional(),
    pricingNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchPriceSelect>;

export const WatchPriceFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    costPrice: z.boolean().optional(),
    serviceCost: z.boolean().optional(),
    landedCost: z.boolean().optional(),
    listPrice: z.boolean().optional(),
    salePrice: z.boolean().optional(),
    minPrice: z.boolean().optional(),
    pricingNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict();

export const WatchPriceFindFirstOrThrowSchema: z.ZodType<Prisma.WatchPriceFindFirstOrThrowArgs> = z.object({ select: WatchPriceFindFirstOrThrowSelectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), orderBy: z.union([WatchPriceOrderByWithRelationInputObjectSchema, WatchPriceOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchPriceWhereInputObjectSchema.optional(), cursor: WatchPriceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchPriceScalarFieldEnumSchema, WatchPriceScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchPriceFindFirstOrThrowArgs>;

export const WatchPriceFindFirstOrThrowZodSchema = z.object({ select: WatchPriceFindFirstOrThrowSelectSchema.optional(), include: WatchPriceIncludeObjectSchema.optional(), orderBy: z.union([WatchPriceOrderByWithRelationInputObjectSchema, WatchPriceOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchPriceWhereInputObjectSchema.optional(), cursor: WatchPriceWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchPriceScalarFieldEnumSchema, WatchPriceScalarFieldEnumSchema.array()]).optional() }).strict();