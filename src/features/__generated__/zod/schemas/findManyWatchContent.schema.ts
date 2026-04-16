import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchContentIncludeObjectSchema as WatchContentIncludeObjectSchema } from './objects/WatchContentInclude.schema';
import { WatchContentOrderByWithRelationInputObjectSchema as WatchContentOrderByWithRelationInputObjectSchema } from './objects/WatchContentOrderByWithRelationInput.schema';
import { WatchContentWhereInputObjectSchema as WatchContentWhereInputObjectSchema } from './objects/WatchContentWhereInput.schema';
import { WatchContentWhereUniqueInputObjectSchema as WatchContentWhereUniqueInputObjectSchema } from './objects/WatchContentWhereUniqueInput.schema';
import { WatchContentScalarFieldEnumSchema } from './enums/WatchContentScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchContentFindManySelectSchema: z.ZodType<Prisma.WatchContentSelect> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    titleOverride: z.boolean().optional(),
    summary: z.boolean().optional(),
    hookText: z.boolean().optional(),
    body: z.boolean().optional(),
    bulletSpecs: z.boolean().optional(),
    seoTitle: z.boolean().optional(),
    seoDescription: z.boolean().optional(),
    aiMetaJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchContentSelect>;

export const WatchContentFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    titleOverride: z.boolean().optional(),
    summary: z.boolean().optional(),
    hookText: z.boolean().optional(),
    body: z.boolean().optional(),
    bulletSpecs: z.boolean().optional(),
    seoTitle: z.boolean().optional(),
    seoDescription: z.boolean().optional(),
    aiMetaJson: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict();

export const WatchContentFindManySchema: z.ZodType<Prisma.WatchContentFindManyArgs> = z.object({ select: WatchContentFindManySelectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), orderBy: z.union([WatchContentOrderByWithRelationInputObjectSchema, WatchContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchContentWhereInputObjectSchema.optional(), cursor: WatchContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchContentScalarFieldEnumSchema, WatchContentScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchContentFindManyArgs>;

export const WatchContentFindManyZodSchema = z.object({ select: WatchContentFindManySelectSchema.optional(), include: WatchContentIncludeObjectSchema.optional(), orderBy: z.union([WatchContentOrderByWithRelationInputObjectSchema, WatchContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchContentWhereInputObjectSchema.optional(), cursor: WatchContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchContentScalarFieldEnumSchema, WatchContentScalarFieldEnumSchema.array()]).optional() }).strict();