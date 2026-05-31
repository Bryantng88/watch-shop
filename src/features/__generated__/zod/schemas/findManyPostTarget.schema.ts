import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PostTargetIncludeObjectSchema as PostTargetIncludeObjectSchema } from './objects/PostTargetInclude.schema';
import { PostTargetOrderByWithRelationInputObjectSchema as PostTargetOrderByWithRelationInputObjectSchema } from './objects/PostTargetOrderByWithRelationInput.schema';
import { PostTargetWhereInputObjectSchema as PostTargetWhereInputObjectSchema } from './objects/PostTargetWhereInput.schema';
import { PostTargetWhereUniqueInputObjectSchema as PostTargetWhereUniqueInputObjectSchema } from './objects/PostTargetWhereUniqueInput.schema';
import { PostTargetScalarFieldEnumSchema } from './enums/PostTargetScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const PostTargetFindManySelectSchema: z.ZodType<Prisma.PostTargetSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    platform: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.PostTargetSelect>;

export const PostTargetFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    platform: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const PostTargetFindManySchema: z.ZodType<Prisma.PostTargetFindManyArgs> = z.object({ select: PostTargetFindManySelectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), orderBy: z.union([PostTargetOrderByWithRelationInputObjectSchema, PostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: PostTargetWhereInputObjectSchema.optional(), cursor: PostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PostTargetScalarFieldEnumSchema, PostTargetScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.PostTargetFindManyArgs>;

export const PostTargetFindManyZodSchema = z.object({ select: PostTargetFindManySelectSchema.optional(), include: PostTargetIncludeObjectSchema.optional(), orderBy: z.union([PostTargetOrderByWithRelationInputObjectSchema, PostTargetOrderByWithRelationInputObjectSchema.array()]).optional(), where: PostTargetWhereInputObjectSchema.optional(), cursor: PostTargetWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([PostTargetScalarFieldEnumSchema, PostTargetScalarFieldEnumSchema.array()]).optional() }).strict();