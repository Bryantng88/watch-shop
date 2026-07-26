import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const ProjectionEventDeliveryAvgOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliveryAvgOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliveryAvgOrderByAggregateInput>;
export const ProjectionEventDeliveryAvgOrderByAggregateInputObjectZodSchema = makeSchema();
