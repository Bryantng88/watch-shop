import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductVariantOrderByWithRelationInputObjectSchema as ProductVariantOrderByWithRelationInputObjectSchema } from './objects/ProductVariantOrderByWithRelationInput.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './objects/ProductVariantWhereInput.schema';
import { ProductVariantWhereUniqueInputObjectSchema as ProductVariantWhereUniqueInputObjectSchema } from './objects/ProductVariantWhereUniqueInput.schema';
import { ProductVariantCountAggregateInputObjectSchema as ProductVariantCountAggregateInputObjectSchema } from './objects/ProductVariantCountAggregateInput.schema';

export const ProductVariantCountSchema: z.ZodType<Prisma.ProductVariantCountArgs> = z.object({ orderBy: z.union([ProductVariantOrderByWithRelationInputObjectSchema, ProductVariantOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductVariantWhereInputObjectSchema.optional(), cursor: ProductVariantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductVariantCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductVariantCountArgs>;

export const ProductVariantCountZodSchema = z.object({ orderBy: z.union([ProductVariantOrderByWithRelationInputObjectSchema, ProductVariantOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductVariantWhereInputObjectSchema.optional(), cursor: ProductVariantWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductVariantCountAggregateInputObjectSchema ]).optional() }).strict();