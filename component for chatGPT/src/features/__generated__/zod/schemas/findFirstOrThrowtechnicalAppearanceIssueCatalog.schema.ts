import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema as technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema } from './objects/technicalAppearanceIssueCatalogOrderByWithRelationInput.schema';
import { technicalAppearanceIssueCatalogWhereInputObjectSchema as technicalAppearanceIssueCatalogWhereInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereInput.schema';
import { technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema as technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema } from './objects/technicalAppearanceIssueCatalogWhereUniqueInput.schema';
import { TechnicalAppearanceIssueCatalogScalarFieldEnumSchema } from './enums/TechnicalAppearanceIssueCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const technicalAppearanceIssueCatalogFindFirstOrThrowSelectSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    area: z.boolean().optional(),
    label: z.boolean().optional(),
    deductionScore: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogSelect>;

export const technicalAppearanceIssueCatalogFindFirstOrThrowSelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    area: z.boolean().optional(),
    label: z.boolean().optional(),
    deductionScore: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    isActive: z.boolean().optional(),
    note: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const technicalAppearanceIssueCatalogFindFirstOrThrowSchema: z.ZodType<Prisma.technicalAppearanceIssueCatalogFindFirstOrThrowArgs> = z.object({ select: technicalAppearanceIssueCatalogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema, technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional(), cursor: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAppearanceIssueCatalogScalarFieldEnumSchema, TechnicalAppearanceIssueCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.technicalAppearanceIssueCatalogFindFirstOrThrowArgs>;

export const technicalAppearanceIssueCatalogFindFirstOrThrowZodSchema = z.object({ select: technicalAppearanceIssueCatalogFindFirstOrThrowSelectSchema.optional(),  orderBy: z.union([technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema, technicalAppearanceIssueCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: technicalAppearanceIssueCatalogWhereInputObjectSchema.optional(), cursor: technicalAppearanceIssueCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([TechnicalAppearanceIssueCatalogScalarFieldEnumSchema, TechnicalAppearanceIssueCatalogScalarFieldEnumSchema.array()]).optional() }).strict();