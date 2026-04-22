import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema'

const makeSchema = () => z.object({
  key: SortOrderSchema.optional(),
  label: SortOrderSchema.optional(),
  enabled: SortOrderSchema.optional(),
  batchSize: SortOrderSchema.optional(),
  pausedReason: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  metadata: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  updatedAt: SortOrderSchema.optional(),
  updatedBy: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional()
}).strict();
export const SystemJobControlOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.SystemJobControlOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.SystemJobControlOrderByWithRelationInput>;
export const SystemJobControlOrderByWithRelationInputObjectZodSchema = makeSchema();
