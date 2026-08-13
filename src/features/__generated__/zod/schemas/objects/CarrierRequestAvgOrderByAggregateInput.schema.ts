import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  httpStatus: SortOrderSchema.optional(),
  attemptCount: SortOrderSchema.optional()
}).strict();
export const CarrierRequestAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.CarrierRequestAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.CarrierRequestAvgOrderByAggregateInput>;
export const CarrierRequestAvgOrderByAggregateInputObjectZodSchema = makeSchema();
