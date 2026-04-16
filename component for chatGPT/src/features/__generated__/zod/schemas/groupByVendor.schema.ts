import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { VendorWhereInputObjectSchema as VendorWhereInputObjectSchema } from './objects/VendorWhereInput.schema';
import { VendorOrderByWithAggregationInputObjectSchema as VendorOrderByWithAggregationInputObjectSchema } from './objects/VendorOrderByWithAggregationInput.schema';
import { VendorScalarWhereWithAggregatesInputObjectSchema as VendorScalarWhereWithAggregatesInputObjectSchema } from './objects/VendorScalarWhereWithAggregatesInput.schema';
import { VendorScalarFieldEnumSchema } from './enums/VendorScalarFieldEnum.schema';
import { VendorCountAggregateInputObjectSchema as VendorCountAggregateInputObjectSchema } from './objects/VendorCountAggregateInput.schema';
import { VendorMinAggregateInputObjectSchema as VendorMinAggregateInputObjectSchema } from './objects/VendorMinAggregateInput.schema';
import { VendorMaxAggregateInputObjectSchema as VendorMaxAggregateInputObjectSchema } from './objects/VendorMaxAggregateInput.schema';

export const VendorGroupBySchema: z.ZodType<Prisma.VendorGroupByArgs> = z.object({ where: VendorWhereInputObjectSchema.optional(), orderBy: z.union([VendorOrderByWithAggregationInputObjectSchema, VendorOrderByWithAggregationInputObjectSchema.array()]).optional(), having: VendorScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(VendorScalarFieldEnumSchema), _count: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional(), _min: VendorMinAggregateInputObjectSchema.optional(), _max: VendorMaxAggregateInputObjectSchema.optional() }).strict() as unknown as z.ZodType<Prisma.VendorGroupByArgs>;

export const VendorGroupByZodSchema = z.object({ where: VendorWhereInputObjectSchema.optional(), orderBy: z.union([VendorOrderByWithAggregationInputObjectSchema, VendorOrderByWithAggregationInputObjectSchema.array()]).optional(), having: VendorScalarWhereWithAggregatesInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), by: z.array(VendorScalarFieldEnumSchema), _count: z.union([ z.literal(true), VendorCountAggregateInputObjectSchema ]).optional(), _min: VendorMinAggregateInputObjectSchema.optional(), _max: VendorMaxAggregateInputObjectSchema.optional() }).strict();