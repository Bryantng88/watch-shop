import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CarrierChargeOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CarrierChargeOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierChargeOrderByRelationAggregateInput>;
export const CarrierChargeOrderByRelationAggregateInputObjectZodSchema = makeSchema();
