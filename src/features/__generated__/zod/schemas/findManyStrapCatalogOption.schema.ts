import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { StrapCatalogOptionOrderByWithRelationInputObjectSchema as StrapCatalogOptionOrderByWithRelationInputObjectSchema } from './objects/StrapCatalogOptionOrderByWithRelationInput.schema';
import { StrapCatalogOptionWhereInputObjectSchema as StrapCatalogOptionWhereInputObjectSchema } from './objects/StrapCatalogOptionWhereInput.schema';
import { StrapCatalogOptionWhereUniqueInputObjectSchema as StrapCatalogOptionWhereUniqueInputObjectSchema } from './objects/StrapCatalogOptionWhereUniqueInput.schema';
import { StrapCatalogOptionScalarFieldEnumSchema } from './enums/StrapCatalogOptionScalarFieldEnum.schema';

// Select schema needs to be in file to prevent circular imports
//------------------------------------------------------

export const StrapCatalogOptionFindManySelectSchema: z.ZodType<Prisma.StrapCatalogOptionSelect> = z.object({
    id: z.boolean().optional(),
    kind: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    colorHex: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionSelect>;

export const StrapCatalogOptionFindManySelectZodSchema = z.object({
    id: z.boolean().optional(),
    kind: z.boolean().optional(),
    code: z.boolean().optional(),
    name: z.boolean().optional(),
    colorHex: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional()
  }).strict();

export const StrapCatalogOptionFindManySchema: z.ZodType<Prisma.StrapCatalogOptionFindManyArgs> = z.object({ select: StrapCatalogOptionFindManySelectSchema.optional(),  orderBy: z.union([StrapCatalogOptionOrderByWithRelationInputObjectSchema, StrapCatalogOptionOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapCatalogOptionWhereInputObjectSchema.optional(), cursor: StrapCatalogOptionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapCatalogOptionScalarFieldEnumSchema, StrapCatalogOptionScalarFieldEnumSchema.array()]).optional() }).strict() as unknown as z.ZodType<Prisma.StrapCatalogOptionFindManyArgs>;

export const StrapCatalogOptionFindManyZodSchema = z.object({ select: StrapCatalogOptionFindManySelectSchema.optional(),  orderBy: z.union([StrapCatalogOptionOrderByWithRelationInputObjectSchema, StrapCatalogOptionOrderByWithRelationInputObjectSchema.array()]).optional(), where: StrapCatalogOptionWhereInputObjectSchema.optional(), cursor: StrapCatalogOptionWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), distinct: z.union([StrapCatalogOptionScalarFieldEnumSchema, StrapCatalogOptionScalarFieldEnumSchema.array()]).optional() }).strict();