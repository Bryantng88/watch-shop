import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CustomerOrderByWithRelationInputObjectSchema as CustomerOrderByWithRelationInputObjectSchema } from './objects/CustomerOrderByWithRelationInput.schema';
import { CustomerWhereInputObjectSchema as CustomerWhereInputObjectSchema } from './objects/CustomerWhereInput.schema';
import { CustomerWhereUniqueInputObjectSchema as CustomerWhereUniqueInputObjectSchema } from './objects/CustomerWhereUniqueInput.schema';
import { CustomerCountAggregateInputObjectSchema as CustomerCountAggregateInputObjectSchema } from './objects/CustomerCountAggregateInput.schema';
import { CustomerMinAggregateInputObjectSchema as CustomerMinAggregateInputObjectSchema } from './objects/CustomerMinAggregateInput.schema';
import { CustomerMaxAggregateInputObjectSchema as CustomerMaxAggregateInputObjectSchema } from './objects/CustomerMaxAggregateInput.schema';

export const CustomerAggregateSchema: z.ZodType<Prisma.CustomerAggregateArgs> = z.object({ orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CustomerCountAggregateInputObjectSchema ]).optional(), _min: CustomerMinAggregateInputObjectSchema.optional(), _max: CustomerMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.CustomerAggregateArgs>;

export const CustomerAggregateZodSchema = z.object({ orderBy: z.union([CustomerOrderByWithRelationInputObjectSchema, CustomerOrderByWithRelationInputObjectSchema.array()]).optional(), where: CustomerWhereInputObjectSchema.optional(), cursor: CustomerWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), CustomerCountAggregateInputObjectSchema ]).optional(), _min: CustomerMinAggregateInputObjectSchema.optional(), _max: CustomerMaxAggregateInputObjectSchema.optional() }).strict();