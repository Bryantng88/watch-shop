import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductImageOrderByWithRelationInputObjectSchema as ProductImageOrderByWithRelationInputObjectSchema } from './objects/ProductImageOrderByWithRelationInput.schema';
import { ProductImageWhereInputObjectSchema as ProductImageWhereInputObjectSchema } from './objects/ProductImageWhereInput.schema';
import { ProductImageWhereUniqueInputObjectSchema as ProductImageWhereUniqueInputObjectSchema } from './objects/ProductImageWhereUniqueInput.schema';
import { ProductImageCountAggregateInputObjectSchema as ProductImageCountAggregateInputObjectSchema } from './objects/ProductImageCountAggregateInput.schema';

export const ProductImageCountSchema: z.ZodType<Prisma.ProductImageCountArgs> = z.object({ orderBy: z.union([ProductImageOrderByWithRelationInputObjectSchema, ProductImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductImageWhereInputObjectSchema.optional(), cursor: ProductImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductImageCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductImageCountArgs>;

export const ProductImageCountZodSchema = z.object({ orderBy: z.union([ProductImageOrderByWithRelationInputObjectSchema, ProductImageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductImageWhereInputObjectSchema.optional(), cursor: ProductImageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductImageCountAggregateInputObjectSchema ]).optional() }).strict();