import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  recordId: SortOrderSchema.optional(),
  variantId: SortOrderSchema.optional(),
  name: SortOrderSchema.optional(),
  quantity: SortOrderSchema.optional(),
  unitCost: SortOrderSchema.optional(),
  notes: SortOrderSchema.optional()
}).strict();
export const MaintenancePartCountOrderByAggregateInputObjectSchema: z.ZodType<Prisma.MaintenancePartCountOrderByAggregateInput> = makeSchema() as unknown as z.ZodType<Prisma.MaintenancePartCountOrderByAggregateInput>;
export const MaintenancePartCountOrderByAggregateInputObjectZodSchema = makeSchema();
