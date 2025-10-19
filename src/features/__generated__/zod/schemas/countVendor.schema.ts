import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorOrderByWithRelationInputObjectSchema as VendorOrderByWithRelationInputObjectSchema } from './objects/VendorOrderByWithRelationInput.schema';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';
import { VendorWhereUniqueInputObjectSchema as VendorWhereUniqueInputObjectSchema } from './objects/VendorWhereUniqueInput.schema';
import { VendorCountAggregateInputObjectSchema as VendorCountAggregateInputObjectSchema } from './objects/VendorCountAggregateInput.schema';

export const VendorCountSchema: z.ZodType<Prisma.VendorCountArgs> = z.object({ orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.VendorCountArgs>;

export const VendorCountZodSchema = z.object({ orderBy: z.union([VendorOrderByWithRelationInputObjectSchema, VendorOrderByWithRelationInputObjectSchema.array()]).optional(), where: VendorWhereInputObjectSchema.optional(), cursor: VendorWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional() }).strict();