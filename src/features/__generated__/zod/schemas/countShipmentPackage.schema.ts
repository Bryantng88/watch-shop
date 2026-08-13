import type { Prisma } from '@prisma/client';
import * as z from 'zod';
import { ShipmentPackageOrderByWithRelationInputObjectSchema as ShipmentPackageOrderByWithRelationInputObjectSchema } from './objects/ShipmentPackageOrderByWithRelationInput.schema';
import { ShipmentPackageWhereInputObjectSchema as ShipmentPackageWhereInputObjectSchema } from './objects/ShipmentPackageWhereInput.schema';
import { ShipmentPackageWhereUniqueInputObjectSchema as ShipmentPackageWhereUniqueInputObjectSchema } from './objects/ShipmentPackageWhereUniqueInput.schema';
import { ShipmentPackageCountAggregateInputObjectSchema as ShipmentPackageCountAggregateInputObjectSchema } from './objects/ShipmentPackageCountAggregateInput.schema';

export const ShipmentPackageCountSchema: z.ZodType<Prisma.ShipmentPackageCountArgs> = z.object({ orderBy: z.union([ShipmentPackageOrderByWithRelationInputObjectSchema, ShipmentPackageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentPackageWhereInputObjectSchema.optional(), cursor: ShipmentPackageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ShipmentPackageCountAggregateInputObjectSchema ]).optional() }).strict() as unknown as z.ZodType<Prisma.ShipmentPackageCountArgs>;

export const ShipmentPackageCountZodSchema = z.object({ orderBy: z.union([ShipmentPackageOrderByWithRelationInputObjectSchema, ShipmentPackageOrderByWithRelationInputObjectSchema.array()]).optional(), where: ShipmentPackageWhereInputObjectSchema.optional(), cursor: ShipmentPackageWhereUniqueInputObjectSchema.optional(), take: z.number().optional(), skip: z.number().optional(), select: z.union([ z.literal(true), ShipmentPackageCountAggregateInputObjectSchema ]).optional() }).strict();