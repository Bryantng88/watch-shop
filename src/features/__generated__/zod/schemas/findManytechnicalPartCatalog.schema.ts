import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalPartCatalogOrderByWithRelationInputObjectSchema as technicalPartCatalogOrderByWithRelationInputObjectSchema } from './objects/technicalPartCatalogOrderByWithRelationInput.schema';
import { technicalPartCatalogWhereInputObjectSchema as technicalPartCatalogWhereInputObjectSchema } from './objects/technicalPartCatalogWhereInput.schema';
import { technicalPartCatalogWhereUniqueInputObjectSchema as technicalPartCatalogWhereUniqueInputObjectSchema } from './objects/technicalPartCatalogWhereUniqueInput.schema';
import { TechnicalPartCatalogScalarFieldEnumSchema } from './enums/TechnicalPartCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const technicalPartCatalogFindManySelectSchema: z.ZodType<Prisma.technicalPartCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    appliesTo: z.boolean().optional(),
    partGroup: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogSelect>;

export const technicalPartCatalogFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    appliesTo: z.boolean().optional(),
    partGroup: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const technicalPartCatalogFindManySchema: z.ZodType<Prisma.technicalPartCatalogFindManyArgs> = z.object({ select: technicalPartCatalogFindManySelectSchema.optional(),  orderBy: z.union([technicalPartCatalogOrderByWithRelationInputObjectSchema, technicalPartCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalPartCatalogWhereInputObjectSchema.optional(), cursor: technicalPartCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalPartCatalogScalarFieldEnumSchema, TechnicalPartCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.technicalPartCatalogFindManyArgs>;

export const technicalPartCatalogFindManyZodSchema = z.object({ select: technicalPartCatalogFindManySelectSchema.optional(),  orderBy: z.union([technicalPartCatalogOrderByWithRelationInputObjectSchema, technicalPartCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalPartCatalogWhereInputObjectSchema.optional(), cursor: technicalPartCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalPartCatalogScalarFieldEnumSchema, TechnicalPartCatalogScalarFieldEnumSchema.array()]).optional() }).strict();