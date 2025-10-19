import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: SortOrderSchema.optional()
}).strict();
export const PermissionMaxOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PermissionMaxOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionMaxOrderByAggregateInput>;
export const PermissionMaxOrderByAggregateInputObjectZodSchema = makeSchema();
