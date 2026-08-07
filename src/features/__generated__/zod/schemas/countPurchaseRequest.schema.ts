import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { PurchaseRequestOrderByWithRelationInputObjectSchema as PurchaseRequestOrderByWithRelationInputObjectSchema } from './objects/PurchaseRequestOrderByWithRelationInput.schema';
import { PurchaseRequestWhereInputObjectSchema as PurchaseRequestWhereInputObjectSchema } from './objects/PurchaseRequestWhereInput.schema';
import { PurchaseRequestWhereUniqueInputObjectSchema as PurchaseRequestWhereUniqueInputObjectSchema } from './objects/PurchaseRequestWhereUniqueInput.schema';
import { PurchaseRequestCountAggregateInputObjectSchema as PurchaseRequestCountAggregateInputObjectSchema } from './objects/PurchaseRequestCountAggregateInput.schema';

export const PurchaseRequestCountSchema: z.ZodType<Prisma.PurchaseRequestCountArgs> = z.object({ orderBy: z.union([PurchaseRequestOrderByWithRelationInputObjectSchema, PurchaseRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestWhereInputObjectSchema.optional(), cursor: PurchaseRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PurchaseRequestCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.PurchaseRequestCountArgs>;

export const PurchaseRequestCountZodSchema = z.object({ orderBy: z.union([PurchaseRequestOrderByWithRelationInputObjectSchema, PurchaseRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: PurchaseRequestWhereInputObjectSchema.optional(), cursor: PurchaseRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), PurchaseRequestCountAggregateInputObjectSchema ]).optional() }).strict();