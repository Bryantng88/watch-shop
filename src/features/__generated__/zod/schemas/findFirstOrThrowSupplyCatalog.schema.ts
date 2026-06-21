import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogIncludeObjectSchema as SupplyCatalogIncludeObjectSchema } from './objects/SupplyCatalogInclude.schema';
import { SupplyCatalogOrderByWithRelationInputObjectSchema as SupplyCatalogOrderByWithRelationInputObjectSchema } from './objects/SupplyCatalogOrderByWithRelationInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './objects/SupplyCatalogWhereInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './objects/SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogScalarFieldEnumSchema } from './enums/SupplyCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const SupplyCatalogFindFirstOrThrowSelectSchema: z.ZodType<Prisma.SupplyCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    unit: z.boolean().optional(),
    defaultCost: z.boolean().optional(),
    note: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogSelect>;

export const SupplyCatalogFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    category: z.boolean().optional(),
    unit: z.boolean().optional(),
    defaultCost: z.boolean().optional(),
    note: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const SupplyCatalogFindFirstOrThrowSchema: z.ZodType<Prisma.SupplyCatalogFindFirstOrThrowArgs> = z.object({ select: SupplyCatalogFindFirstOrThrowSelectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), orderBy: z.union([SupplyCatalogOrderByWithRelationInputObjectSchema, SupplyCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SupplyCatalogWhereInputObjectSchema.optional(), cursor: SupplyCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SupplyCatalogScalarFieldEnumSchema, SupplyCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogFindFirstOrThrowArgs>;

export const SupplyCatalogFindFirstOrThrowZodSchema = z.object({ select: SupplyCatalogFindFirstOrThrowSelectSchema.optional(), include: SupplyCatalogIncludeObjectSchema.optional(), orderBy: z.union([SupplyCatalogOrderByWithRelationInputObjectSchema, SupplyCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SupplyCatalogWhereInputObjectSchema.optional(), cursor: SupplyCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([SupplyCatalogScalarFieldEnumSchema, SupplyCatalogScalarFieldEnumSchema.array()]).optional() }).strict();