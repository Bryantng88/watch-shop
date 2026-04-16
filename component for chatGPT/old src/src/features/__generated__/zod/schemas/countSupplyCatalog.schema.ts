import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { SupplyCatalogOrderByWithRelationInputObjectSchema as SupplyCatalogOrderByWithRelationInputObjectSchema } from './objects/SupplyCatalogOrderByWithRelationInput.schema';
import { SupplyCatalogWhereInputObjectSchema as SupplyCatalogWhereInputObjectSchema } from './objects/SupplyCatalogWhereInput.schema';
import { SupplyCatalogWhereUniqueInputObjectSchema as SupplyCatalogWhereUniqueInputObjectSchema } from './objects/SupplyCatalogWhereUniqueInput.schema';
import { SupplyCatalogCountAggregateInputObjectSchema as SupplyCatalogCountAggregateInputObjectSchema } from './objects/SupplyCatalogCountAggregateInput.schema';

export const SupplyCatalogCountSchema: z.ZodType<Prisma.SupplyCatalogCountArgs> = z.object({ orderBy: z.union([SupplyCatalogOrderByWithRelationInputObjectSchema, SupplyCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SupplyCatalogWhereInputObjectSchema.optional(), cursor: SupplyCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SupplyCatalogCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.SupplyCatalogCountArgs>;

export const SupplyCatalogCountZodSchema = z.object({ orderBy: z.union([SupplyCatalogOrderByWithRelationInputObjectSchema, SupplyCatalogOrderByWithRelationInputObjectSchema.array()]).optional(), where: SupplyCatalogWhereInputObjectSchema.optional(), cursor: SupplyCatalogWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), SupplyCatalogCountAggregateInputObjectSchema ]).optional() }).strict();