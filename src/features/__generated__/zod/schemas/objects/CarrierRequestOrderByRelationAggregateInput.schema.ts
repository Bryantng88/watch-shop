import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CarrierRequestOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestOrderByRelationAggregateInput>;
export const CarrierRequestOrderByRelationAggregateInputObjectZodSchema = makeSchema();
