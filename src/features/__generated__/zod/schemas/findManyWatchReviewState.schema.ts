import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewStateIncludeObjectSchema as WatchReviewStateIncludeObjectSchema } from './objects/WatchReviewStateInclude.schema';
import { WatchReviewStateOrderByWithRelationInputObjectSchema as WatchReviewStateOrderByWithRelationInputObjectSchema } from './objects/WatchReviewStateOrderByWithRelationInput.schema';
import { WatchReviewStateWhereInputObjectSchema as WatchReviewStateWhereInputObjectSchema } from './objects/WatchReviewStateWhereInput.schema';
import { WatchReviewStateWhereUniqueInputObjectSchema as WatchReviewStateWhereUniqueInputObjectSchema } from './objects/WatchReviewStateWhereUniqueInput.schema';
import { WatchReviewStateScalarFieldEnumSchema } from './enums/WatchReviewStateScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchReviewStateFindManySelectSchema: z.ZodType<Prisma.WatchReviewStateSelect> = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    productId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    status: z.boolean().optional(),
    submittedAt: z.boolean().optional(),
    submittedById: z.boolean().optional(),
    reviewedAt: z.boolean().optional(),
    reviewedById: z.boolean().optional(),
    reviewNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional(),
    WatchReviewLog: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateSelect>;

export const WatchReviewStateFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    watchId: z.boolean().optional(),
    productId: z.boolean().optional(),
    targetType: z.boolean().optional(),
    status: z.boolean().optional(),
    submittedAt: z.boolean().optional(),
    submittedById: z.boolean().optional(),
    reviewedAt: z.boolean().optional(),
    reviewedById: z.boolean().optional(),
    reviewNote: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    watch: z.boolean().optional(),
    WatchReviewLog: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const WatchReviewStateFindManySchema: z.ZodType<Prisma.WatchReviewStateFindManyArgs> = z.object({ select: WatchReviewStateFindManySelectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), orderBy: z.union([WatchReviewStateOrderByWithRelationInputObjectSchema, WatchReviewStateOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewStateWhereInputObjectSchema.optional(), cursor: WatchReviewStateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchReviewStateScalarFieldEnumSchema, WatchReviewStateScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewStateFindManyArgs>;

export const WatchReviewStateFindManyZodSchema = z.object({ select: WatchReviewStateFindManySelectSchema.optional(), include: WatchReviewStateIncludeObjectSchema.optional(), orderBy: z.union([WatchReviewStateOrderByWithRelationInputObjectSchema, WatchReviewStateOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewStateWhereInputObjectSchema.optional(), cursor: WatchReviewStateWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchReviewStateScalarFieldEnumSchema, WatchReviewStateScalarFieldEnumSchema.array()]).optional() }).strict();