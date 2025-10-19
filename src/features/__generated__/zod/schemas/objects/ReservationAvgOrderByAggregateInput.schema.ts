import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  depositAmt: SortOrderSchema.optional()
}).strict();
export const ReservationAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ReservationAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationAvgOrderByAggregateInput>;
export const ReservationAvgOrderByAggregateInputObjectZodSchema = makeSchema();
