import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { BrandIncludeObjectSchema as BrandIncludeObjectSchema } from './objects/BrandInclude.schema';
import { BrandOrderByWithRelationInputObjectSchema as BrandOrderByWithRelationInputObjectSchema } from './objects/BrandOrderByWithRelationInput.schema';
import { BrandWhereInputObjectSchema as BrandWhereInputObjectSchema } from './objects/BrandWhereInput.schema';
import { BrandWhereUniqueInputObjectSchema as BrandWhereUniqueInputObjectSchema } from './objects/BrandWhereUniqueInput.schema';
import { BrandScalarFieldEnumSchema } from './enums/BrandScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const BrandFindFirstSelectSchema: z.ZodType<Prisma.BrandSelect> = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    slug: z.boolean().optional(),
    country: z.boolean().optional(),
    foundedYear: z.boolean().optional(),
    website: z.boolean().optional(),
    logoUrl: z.boolean().optional(),
    isAuthorized: z.boolean().optional(),
    status: z.boolean().optional(),
    description: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.BrandSelect>;

export const BrandFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    name: z.boolean().optional(),
    slug: z.boolean().optional(),
    country: z.boolean().optional(),
    foundedYear: z.boolean().optional(),
    website: z.boolean().optional(),
    logoUrl: z.boolean().optional(),
    isAuthorized: z.boolean().optional(),
    status: z.boolean().optional(),
    description: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    products: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const BrandFindFirstSchema: z.ZodType<Prisma.BrandFindFirstArgs> = z.object({ select: BrandFindFirstSelectSchema.optional(), include: BrandIncludeObjectSchema.optional(), orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BrandScalarFieldEnumSchema, BrandScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.BrandFindFirstArgs>;

export const BrandFindFirstZodSchema = z.object({ select: BrandFindFirstSelectSchema.optional(), include: BrandIncludeObjectSchema.optional(), orderBy: z.union([BrandOrderByWithRelationInputObjectSchema, BrandOrderByWithRelationInputObjectSchema.array()]).optional(), where: BrandWhereInputObjectSchema.optional(), cursor: BrandWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([BrandScalarFieldEnumSchema, BrandScalarFieldEnumSchema.array()]).optional() }).strict();