import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ShipmentPackageOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentPackageOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentPackageOrderByRelationAggregateInput>;
export const ShipmentPackageOrderByRelationAggregateInputObjectZodSchema = makeSchema();
