import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const TechnicalIssueOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.TechnicalIssueOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.TechnicalIssueOrderByRelationAggregateInput>;
export const TechnicalIssueOrderByRelationAggregateInputObjectZodSchema = makeSchema();
