import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ShipmentOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ShipmentOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentOrderByRelationAggregateInput>;
export const ShipmentOrderByRelationAggregateInputObjectZodSchema = makeSchema();
