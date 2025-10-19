import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AcquisitionOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionOrderByRelationAggregateInput>;
export const AcquisitionOrderByRelationAggregateInputObjectZodSchema = makeSchema();
