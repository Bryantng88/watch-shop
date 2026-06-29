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
export const BusinessEventLogMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.BusinessEventLogMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogMaxOrderByAggregateInput>;
export const BusinessEventLogMaxOrderByAggregateInputObjectZodSchema = makeSchema();
