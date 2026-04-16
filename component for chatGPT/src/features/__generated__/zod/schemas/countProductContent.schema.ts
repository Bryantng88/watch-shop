import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ProductContentOrderByWithRelationInputObjectSchema as ProductContentOrderByWithRelationInputObjectSchema } from './objects/ProductContentOrderByWithRelationInput.schema';
import { ProductContentWhereInputObjectSchema as ProductContentWhereInputObjectSchema } from './objects/ProductContentWhereInput.schema';
import { ProductContentWhereUniqueInputObjectSchema as ProductContentWhereUniqueInputObjectSchema } from './objects/ProductContentWhereUniqueInput.schema';
import { ProductContentCountAggregateInputObjectSchema as ProductContentCountAggregateInputObjectSchema } from './objects/ProductContentCountAggregateInput.schema';

export const ProductContentCountSchema: z.ZodType<Prisma.ProductContentCountArgs> = z.object({ orderBy: z.union([ProductContentOrderByWithRelationInputObjectSchema, ProductContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductContentWhereInputObjectSchema.optional(), cursor: ProductContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductContentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ProductContentCountArgs>;

export const ProductContentCountZodSchema = z.object({ orderBy: z.union([ProductContentOrderByWithRelationInputObjectSchema, ProductContentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ProductContentWhereInputObjectSchema.optional(), cursor: ProductContentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ProductContentCountAggregateInputObjectSchema ]).optional() }).strict();