import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  _count: SortOrderSchema.optional()
}).strict();
export const AppTagLinkOrderByRelationAggregateInputObjectSchema: z.ZodType<Prisma.AppTagLinkOrderByRelationAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.AppTagLinkOrderByRelationAggregateInput>;
export const AppTagLinkOrderByRelationAggregateInputObjectZodSchema = makeSchema();
