import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { MechanicalPartCatalogIncludeObjectSchema as MechanicalPartCatalogIncludeObjectSchema } from './objects/MechanicalPartCatalogInclude.schema';
import { MechanicalPartCatalogOrderByWithRelationInputObjectSchema as MechanicalPartCatalogOrderByWithRelationInputObjectSchema } from './objects/MechanicalPartCatalogOrderByWithRelationInput.schema';
import { MechanicalPartCatalogWhereInputObjectSchema as MechanicalPartCatalogWhereInputObjectSchema } from './objects/MechanicalPartCatalogWhereInput.schema';
import { MechanicalPartCatalogWhereUniqueInputObjectSchema as MechanicalPartCatalogWhereUniqueInputObjectSchema } from './objects/MechanicalPartCatalogWhereUniqueInput.schema';
import { MechanicalPartCatalogScalarFieldEnumSchema } from './enums/MechanicalPartCatalogScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const MechanicalPartCatalogFindManySelectSchema: z.ZodType<Prisma.MechanicalPartCatalogSelect> = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    group: z.boolean().optional(),
    defaultCost: z.boolean().optional(),
    note: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogSelect>;

export const MechanicalPartCatalogFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    group: z.boolean().optional(),
    defaultCost: z.boolean().optional(),
    note: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    TechnicalIssue: z.boolean().optional(),
    _count: z.boolean().optional()
  }).strict();

export const MechanicalPartCatalogFindManySchema: z.ZodType<Prisma.MechanicalPartCatalogFindManyArgs> = z.object({ select: MechanicalPartCatalogFindManySelectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), orderBy: z.union([MechanicalPartCatalogOrderByWithRelationInputObjectSchema, MechanicalPartCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: MechanicalPartCatalogWhereInputObjectSchema.optional(), cursor: MechanicalPartCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MechanicalPartCatalogScalarFieldEnumSchema, MechanicalPartCatalogScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.MechanicalPartCatalogFindManyArgs>;

export const MechanicalPartCatalogFindManyZodSchema = z.object({ select: MechanicalPartCatalogFindManySelectSchema.optional(), include: MechanicalPartCatalogIncludeObjectSchema.optional(), orderBy: z.union([MechanicalPartCatalogOrderByWithRelationInputObjectSchema, MechanicalPartCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: MechanicalPartCatalogWhereInputObjectSchema.optional(), cursor: MechanicalPartCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([MechanicalPartCatalogScalarFieldEnumSchema, MechanicalPartCatalogScalarFieldEnumSchema.array()]).optional() }).strict();