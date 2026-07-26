import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const ProjectionEventDeliveryOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryOrderByRelationAggregateInput>;
export const ProjectionEventDeliveryOrderByRelationAggregateInputObjectZodSchema = makeSchema();
