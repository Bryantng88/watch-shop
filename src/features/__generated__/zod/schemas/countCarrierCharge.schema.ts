import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierChargeOrderByWithRelationInputObjectSchema as CarrierChargeOrderByWithRelationInputObjectSchema } from './objects/CarrierChargeOrderByWithRelationInput.schema';
import { CarrierChargeWhereInputObjectSchema as CarrierChargeWhereInputObjectSchema } from './objects/CarrierChargeWhereInput.schema';
import { CarrierChargeWhereUniqueInputObjectSchema as CarrierChargeWhereUniqueInputObjectSchema } from './objects/CarrierChargeWhereUniqueInput.schema';
import { CarrierChargeCountAggregateInputObjectSchema as CarrierChargeCountAggregateInputObjectSchema } from './objects/CarrierChargeCountAggregateInput.schema';

export const CarrierChargeCountSchema: z.ZodType<Prisma.CarrierChargeCountArgs> = z.object({ orderBy: z.union([CarrierChargeOrderByWithRelationInputObjectSchema, CarrierChargeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierChargeWhereInputObjectSchema.optional(), cursor: CarrierChargeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CarrierChargeCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierChargeCountArgs>;

export const CarrierChargeCountZodSchema = z.object({ orderBy: z.union([CarrierChargeOrderByWithRelationInputObjectSchema, CarrierChargeOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierChargeWhereInputObjectSchema.optional(), cursor: CarrierChargeWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CarrierChargeCountAggregateInputObjectSchema ]).optional() }).strict();