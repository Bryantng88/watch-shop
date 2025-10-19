import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  depositAmt: SortOrderSchema.optional()
}).strict();
export const ReservationSumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ReservationSumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationSumOrderByAggregateInput>;
export const ReservationSumOrderByAggregateInputObjectZodSchema = makeSchema();
