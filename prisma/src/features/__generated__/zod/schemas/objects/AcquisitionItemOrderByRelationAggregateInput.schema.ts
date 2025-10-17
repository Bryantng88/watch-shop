import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AcquisitionItemOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionItemOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionItemOrderByRelationAggregateInput>;
export const AcquisitionItemOrderByRelationAggregateInputObjectZodSchema = makeSchema();
