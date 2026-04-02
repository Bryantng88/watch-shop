import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const approvalRequestsOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.approvalRequestsOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.approvalRequestsOrderByRelationAggregateInput>;
export const approvalRequestsOrderByRelationAggregateInputObjectZodSchema = makeSchema();
