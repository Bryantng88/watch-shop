import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { WatchReviewLogIncludeObjectSchema as WatchReviewLogIncludeObjectSchema } from './objects/WatchReviewLogInclude.schema';
import { WatchReviewLogOrderByWithRelationInputObjectSchema as WatchReviewLogOrderByWithRelationInputObjectSchema } from './objects/WatchReviewLogOrderByWithRelationInput.schema';
import { WatchReviewLogWhereInputObjectSchema as WatchReviewLogWhereInputObjectSchema } from './objects/WatchReviewLogWhereInput.schema';
import { WatchReviewLogWhereUniqueInputObjectSchema as WatchReviewLogWhereUniqueInputObjectSchema } from './objects/WatchReviewLogWhereUniqueInput.schema';
import { WatchReviewLogScalarFieldEnumSchema } from './enums/WatchReviewLogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const WatchReviewLogFindManySelectSchema: z.ZodType<Prisma.WatchReviewLogSelect> = z.object({
    id: z.boolean().optional(),
    reviewStateId: z.boolean().optional(),
    action: z.boolean().optional(),
    fromStatus: z.boolean().optional(),
    toStatus: z.boolean().optional(),
    actorId: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    reviewState: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogSelect>;

export const WatchReviewLogFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    reviewStateId: z.boolean().optional(),
    action: z.boolean().optional(),
    fromStatus: z.boolean().optional(),
    toStatus: z.boolean().optional(),
    actorId: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    reviewState: z.boolean().optional()
  }).strict();

export const WatchReviewLogFindManySchema: z.ZodType<Prisma.WatchReviewLogFindManyArgs> = z.object({ select: WatchReviewLogFindManySelectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), orderBy: z.union([WatchReviewLogOrderByWithRelationInputObjectSchema, WatchReviewLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewLogWhereInputObjectSchema.optional(), cursor: WatchReviewLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchReviewLogScalarFieldEnumSchema, WatchReviewLogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.WatchReviewLogFindManyArgs>;

export const WatchReviewLogFindManyZodSchema = z.object({ select: WatchReviewLogFindManySelectSchema.optional(), include: WatchReviewLogIncludeObjectSchema.optional(), orderBy: z.union([WatchReviewLogOrderByWithRelationInputObjectSchema, WatchReviewLogOrderByWithRelationInputObjectSchema.array()]).optional(), where: WatchReviewLogWhereInputObjectSchema.optional(), cursor: WatchReviewLogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([WatchReviewLogScalarFieldEnumSchema, WatchReviewLogScalarFieldEnumSchema.array()]).optional() }).strict();