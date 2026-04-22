import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  processorKey: SortOrderSchema.optional(),
  triggerSource: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  processedCount: SortOrderSchema.optional(),
  errorCount: SortOrderSchema.optional(),
  note: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  detail: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: SortOrderSchema.optional(),
  finishedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const SystemJobRunLogOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobRunLogOrderByWithRelationInput>;
export const SystemJobRunLogOrderByWithRelationInputObjectZodSchema = makeSchema();
