import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentOrderByWithRelationInputObjectSchema as ShipmentOrderByWithRelationInputObjectSchema } from './objects/ShipmentOrderByWithRelationInput.schema';
import { ShipmentWhereInputObjectSchema as ShipmentWhereInputObjectSchema } from './objects/ShipmentWhereInput.schema';
import { ShipmentWhereUniqueInputObjectSchema as ShipmentWhereUniqueInputObjectSchema } from './objects/ShipmentWhereUniqueInput.schema';
import { ShipmentCountAggregateInputObjectSchema as ShipmentCountAggregateInputObjectSchema } from './objects/ShipmentCountAggregateInput.schema';

export const ShipmentCountSchema: z.ZodType<Prisma.ShipmentCountArgs> = z.object({ orderBy: z.union([ShipmentOrderByWithRelationInputObjectSchema, ShipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentWhereInputObjectSchema.optional(), cursor: ShipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ShipmentCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentCountArgs>;

export const ShipmentCountZodSchema = z.object({ orderBy: z.union([ShipmentOrderByWithRelationInputObjectSchema, ShipmentOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentWhereInputObjectSchema.optional(), cursor: ShipmentWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ShipmentCountAggregateInputObjectSchema ]).optional() }).strict();