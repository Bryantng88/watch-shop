import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ServiceRequestOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ServiceRequestOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestOrderByRelationAggregateInput>;
export const ServiceRequestOrderByRelationAggregateInputObjectZodSchema = makeSchema();
