import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchMediaIncludeObjectSchema as WatchMediaIncludeObjectSchema } from './objects/WatchMediaInclude.schema';
import { WatchMediaOrderByWithRelationInputObjectSchema as WatchMediaOrderByWithRelationInputObjectSchema } from './objects/WatchMediaOrderByWithRelationInput.schema';
import { WatchMediaWhereInputObjectSchema as WatchMediaWhereInputObjectSchema } from './objects/WatchMediaWhereInput.schema';
import { WatchMediaWhereUniqueInputObjectSchema as WatchMediaWhereUniqueInputObjectSchema } from './objects/WatchMediaWhereUniqueInput.schema';
import { WatchMediaScalarFieldEnumSchema } from './enums/WatchMediaScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchMediaFindFirstOrThrowSelectSchema: z.ZodType<Prisma.WatchMediaSelect> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    legacyProductImageId: z.boolean().optional(),
    key: z.boolean().optional(),
    url: z.boolean().optional(),
    type: z.boolean().optional(),
    role: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    alt: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    mime: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    dominantHex: z.boolean().optional(),
    contentHash: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchMediaSelect>;

export const WatchMediaFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    legacyProductImageId: z.boolean().optional(),
    key: z.boolean().optional(),
    url: z.boolean().optional(),
    type: z.boolean().optional(),
    role: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    alt: z.boolean().optional(),
    width: z.boolean().optional(),
    height: z.boolean().optional(),
    mime: z.boolean().optional(),
    sizeBytes: z.boolean().optional(),
    dominantHex: z.boolean().optional(),
    contentHash: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional()
  }).strict();

export const WatchMediaFindFirstOrThrowSchema: z.ZodType<Prisma.WatchMediaFindFirstOrThrowArgs> = z.object({ select: WatchMediaFindFirstOrThrowSelectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), orderBy: z.union([WatchMediaOrderByWithRelationInputObjectSchema, WatchMediaOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchMediaWhereInputObjectSchema.optional(), cursor: WatchMediaWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchMediaScalarFieldEnumSchema, WatchMediaScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchMediaFindFirstOrThrowArgs>;

export const WatchMediaFindFirstOrThrowZodSchema = z.object({ select: WatchMediaFindFirstOrThrowSelectSchema.optional(), include: WatchMediaIncludeObjectSchema.optional(), orderBy: z.union([WatchMediaOrderByWithRelationInputObjectSchema, WatchMediaOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchMediaWhereInputObjectSchema.optional(), cursor: WatchMediaWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchMediaScalarFieldEnumSchema, WatchMediaScalarFieldEnumSchema.array()]).optional() }).strict();