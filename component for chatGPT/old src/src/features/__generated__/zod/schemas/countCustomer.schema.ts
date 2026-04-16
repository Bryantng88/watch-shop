import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './objects/CustomerOrderByWithRelationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';
import { CustomerCountAggregateInputObjectSchema as CustomerCountAggregateInputObjectSchema } from './objects/CustomerCountAggregateInput.schema';

export const CustomerCountSchema: z.ZodType<Prisma.CustomerCountArgs> = z.object({ orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CustomerCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CustomerCountArgs>;

export const CustomerCountZodSchema = z.object({ orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CustomerCountAggregateInputObjectSchema ]).optional() }).strict();