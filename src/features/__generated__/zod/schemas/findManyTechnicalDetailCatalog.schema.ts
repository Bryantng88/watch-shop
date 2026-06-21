import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { TechnicalDetailCatalogIncludeObjectSchema as TechnicalDetailCatalogIncludeObjectSchema } from './objects/TechnicalDetailCatalogInclude.schema';
import { TechnicalDetailCatalogOrderByWithRelationInputObjectSchema as TechnicalDetailCatalogOrderByWithRelationInputObjectSchema } from './objects/TechnicalDetailCatalogOrderByWithRelationInput.schema';
import { TechnicalDetailCatalogWhereInputObjectSchema as TechnicalDetailCatalogWhereInputObjectSchema } from './objects/TechnicalDetailCatalogWhereInput.schema';
import { TechnicalDetailCatalogWhereUniqueInputObjectSchema as TechnicalDetailCatalogWhereUniqueInputObjectSchema } from './objects/TechnicalDetailCatalogWhereUniqueInput.schema';
import { TechnicalDetailCatalogScalarFieldEnumSchema } from './enums/TechnicalDetailCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const TechnicalDetailCatalogFindManySelectSchema: z.ZodType<Prisma.TechnicalDetailCatalogSelect> = z.object({
    id: z.boolean().optional(),
    area: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    technicalIssues: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogSelect>;

export const TechnicalDetailCatalogFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    area: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    description: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    technicalIssues: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const TechnicalDetailCatalogFindManySchema: z.ZodType<Prisma.TechnicalDetailCatalogFindManyArgs> = z.object({ select: TechnicalDetailCatalogFindManySelectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), orderBy: z.union([TechnicalDetailCatalogOrderByWithRelationInputObjectSchema, TechnicalDetailCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalDetailCatalogWhereInputObjectSchema.optional(), cursor: TechnicalDetailCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalDetailCatalogScalarFieldEnumSchema, TechnicalDetailCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.TechnicalDetailCatalogFindManyArgs>;

export const TechnicalDetailCatalogFindManyZodSchema = z.object({ select: TechnicalDetailCatalogFindManySelectSchema.optional(), include: TechnicalDetailCatalogIncludeObjectSchema.optional(), orderBy: z.union([TechnicalDetailCatalogOrderByWithRelationInputObjectSchema, TechnicalDetailCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: TechnicalDetailCatalogWhereInputObjectSchema.optional(), cursor: TechnicalDetailCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalDetailCatalogScalarFieldEnumSchema, TechnicalDetailCatalogScalarFieldEnumSchema.array()]).optional() }).strict();