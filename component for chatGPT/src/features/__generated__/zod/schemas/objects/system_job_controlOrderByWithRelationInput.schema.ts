import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batch_size: SortOrderSchema.optional(),
  paused_reason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updated_at: SortOrderSchema.optional(),
  updated_by: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const system_job_controlOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.system_job_controlOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.system_job_controlOrderByWithRelationInput>;
export const system_job_controlOrderByWithRelationInputObjectZodSchema = makeSchema();
