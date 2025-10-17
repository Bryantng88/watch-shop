import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ReservationOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ReservationOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ReservationOrderByRelationAggregateInput>;
export const ReservationOrderByRelationAggregateInputObjectZodSchema = makeSchema();
