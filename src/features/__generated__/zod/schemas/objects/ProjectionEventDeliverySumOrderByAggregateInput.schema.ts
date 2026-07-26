import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  attempts: SortOrderSchema.optional()
}).strict();
export const ProjectionEventDeliverySumOrderByAggregateInputObjectSchema: z.ZodType<Prisma.ProjectionEventDeliverySumOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.ProjectionEventDeliverySumOrderByAggregateInput>;
export const ProjectionEventDeliverySumOrderByAggregateInputObjectZodSchema = makeSchema();
