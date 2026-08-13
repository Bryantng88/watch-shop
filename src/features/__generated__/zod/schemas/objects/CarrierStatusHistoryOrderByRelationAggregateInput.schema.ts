import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const CarrierStatusHistoryOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.CarrierStatusHistoryOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierStatusHistoryOrderByRelationAggregateInput>;
export const CarrierStatusHistoryOrderByRelationAggregateInputObjectZodSchema = makeSchema();
