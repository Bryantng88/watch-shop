import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { AppTagIncludeObjectSchema as AppTagIncludeObjectSchema } from './objects/AppTagInclude.schema';
import { AppTagOrderByWithRelationInputObjectSchema as AppTagOrderByWithRelationInputObjectSchema } from './objects/AppTagOrderByWithRelationInput.schema';
import { AppTagWhereInputObjectSchema as AppTagWhereInputObjectSchema } from './objects/AppTagWhereInput.schema';
import { AppTagWhereUniqueInputObjectSchema as AppTagWhereUniqueInputObjectSchema } from './objects/AppTagWhereUniqueInput.schema';
import { AppTagScalarFieldEnumSchema } from './enums/AppTagScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const AppTagFindFirstSelectSchema: z.ZodType<Prisma.AppTagSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    slug: z.boolean().optional(),
    color: z.boolean().optional(),
    scope: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    links: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.AppTagSelect>;

export const AppTagFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    slug: z.boolean().optional(),
    color: z.boolean().optional(),
    scope: z.boolean().optional(),
    ownerType: z.boolean().optional(),
    ownerId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    links: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const AppTagFindFirstSchema: z.ZodType<Prisma.AppTagFindFirstArgs> = z.object({ select: AppTagFindFirstSelectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AppTagScalarFieldEnumSchema, AppTagScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.AppTagFindFirstArgs>;

export const AppTagFindFirstZodSchema = z.object({ select: AppTagFindFirstSelectSchema.optional(), include: AppTagIncludeObjectSchema.optional(), orderBy: z.union([AppTagOrderByWithRelationInputObjectSchema, AppTagOrderByWithRelationInputObjectSchema.array()]).optional(), where: AppTagWhereInputObjectSchema.optional(), cursor: AppTagWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([AppTagScalarFieldEnumSchema, AppTagScalarFieldEnumSchema.array()]).optional() }).strict();