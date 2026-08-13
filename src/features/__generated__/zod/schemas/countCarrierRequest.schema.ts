import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { CarrierRequestOrderByWithRelationInputObjectSchema as CarrierRequestOrderByWithRelationInputObjectSchema } from './objects/CarrierRequestOrderByWithRelationInput.schema';
import { CarrierRequestWhereInputObjectSchema as CarrierRequestWhereInputObjectSchema } from './objects/CarrierRequestWhereInput.schema';
import { CarrierRequestWhereUniqueInputObjectSchema as CarrierRequestWhereUniqueInputObjectSchema } from './objects/CarrierRequestWhereUniqueInput.schema';
import { CarrierRequestCountAggregateInputObjectSchema as CarrierRequestCountAggregateInputObjectSchema } from './objects/CarrierRequestCountAggregateInput.schema';

export const CarrierRequestCountSchema: z.ZodType<Prisma.CarrierRequestCountArgs> = z.object({ orderBy: z.union([CarrierRequestOrderByWithRelationInputObjectSchema, CarrierRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierRequestWhereInputObjectSchema.optional(), cursor: CarrierRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CarrierRequestCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.CarrierRequestCountArgs>;

export const CarrierRequestCountZodSchema = z.object({ orderBy: z.union([CarrierRequestOrderByWithRelationInputObjectSchema, CarrierRequestOrderByWithRelationInputObjectSchema.array()]).optional(), where: CarrierRequestWhereInputObjectSchema.optional(), cursor: CarrierRequestWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), CarrierRequestCountAggregateInputObjectSchema ]).optional() }).strict();