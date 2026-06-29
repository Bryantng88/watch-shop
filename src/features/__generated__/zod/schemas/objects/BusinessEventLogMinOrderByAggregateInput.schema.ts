import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  eventKey: SortOrderSchema.optional(),
  targetType: SortOrderSchema.optional(),
  targetId: SortOrderSchema.optional(),
  actorUserId: SortOrderSchema.optional(),
  createdAt: SortOrderSchema.optional()
}).strict();
export const BusinessEventLogMinOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BusinessEventLogMinOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogMinOrderByAggregateInput>;
export const BusinessEventLogMinOrderByAggregateInputObjectZodSchema = makeSchema();
