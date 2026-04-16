import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalActionCatalogOrderByWithRelationInputObjectSchema as technicalActionCatalogOrderByWithRelationInputObjectSchema } from './objects/technicalActionCatalogOrderByWithRelationInput.schema';
import { technicalActionCatalogWhereInputObjectSchema as technicalActionCatalogWhereInputObjectSchema } from './objects/technicalActionCatalogWhereInput.schema';
import { technicalActionCatalogWhereUniqueInputObjectSchema as technicalActionCatalogWhereUniqueInputObjectSchema } from './objects/technicalActionCatalogWhereUniqueInput.schema';
import { TechnicalActionCatalogScalarFieldEnumSchema } from './enums/TechnicalActionCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const technicalActionCatalogFindFirstSelectSchema: z.ZodType<Prisma.technicalActionCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    appliesTo: z.boolean().optional(),
    groupKey: z.boolean().optional(),
    requiresPart: z.boolean().optional(),
    defaultExecutionMode: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogSelect>;

export const technicalActionCatalogFindFirstSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    appliesTo: z.boolean().optional(),
    groupKey: z.boolean().optional(),
    requiresPart: z.boolean().optional(),
    defaultExecutionMode: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const technicalActionCatalogFindFirstSchema: z.ZodType<Prisma.technicalActionCatalogFindFirstArgs> = z.object({ select: technicalActionCatalogFindFirstSelectSchema.optional(),  orderBy: z.union([technicalActionCatalogOrderByWithRelationInputObjectSchema, technicalActionCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalActionCatalogWhereInputObjectSchema.optional(), cursor: technicalActionCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalActionCatalogScalarFieldEnumSchema, TechnicalActionCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.technicalActionCatalogFindFirstArgs>;

export const technicalActionCatalogFindFirstZodSchema = z.object({ select: technicalActionCatalogFindFirstSelectSchema.optional(),  orderBy: z.union([technicalActionCatalogOrderByWithRelationInputObjectSchema, technicalActionCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalActionCatalogWhereInputObjectSchema.optional(), cursor: technicalActionCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalActionCatalogScalarFieldEnumSchema, TechnicalActionCatalogScalarFieldEnumSchema.array()]).optional() }).strict();