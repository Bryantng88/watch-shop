import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  code: SortOrderSchema.optional(),
  description: SortOrderSchema.optional()
}).strict();
export const PermissionCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.PermissionCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.PermissionCountOrderByAggregateInput>;
export const PermissionCountOrderByAggregateInputObjectZodSchema = makeSchema();
