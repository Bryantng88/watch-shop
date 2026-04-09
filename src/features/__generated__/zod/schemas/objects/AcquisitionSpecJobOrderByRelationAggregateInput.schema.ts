import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AcquisitionSpecJobOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobOrderByRelationAggregateInput>;
export const AcquisitionSpecJobOrderByRelationAggregateInputObjectZodSchema = makeSchema();
