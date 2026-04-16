import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './objects/VendorOrderByWithRelationInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';
import { VendorCountAggregateInputObjectSchema as VendorCountAggregateInputObjectSchema } from './objects/VendorCountAggregateInput.schema';
import { VendorMinAggregateInputObjectSchema as VendorMinAggregateInputObjectSchema } from './objects/VendorMinAggregateInput.schema';
import { VendorMaxAggregateInputObjectSchema as VendorMaxAggregateInputObjectSchema } from './objects/VendorMaxAggregateInput.schema';

export const VendorAggregateSchema: z.ZodType<Prisma.VendorAggregateArgs> = z.object({ orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional(), _min: VendorMinAggregateInputObjectSchema.optional(), _max: VendorMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.VendorAggregateArgs>;

export const VendorAggregateZodSchema = z.object({ orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), _count: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional(), _min: VendorMinAggregateInputObjectSchema.optional(), _max: VendorMaxAggregateInputObjectSchema.optional() }).strict();