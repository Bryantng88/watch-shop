import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaBindingOrderByRelationAggregateInputObjectSchema as MediaBindingOrderByRelationAggregateInputObjectSchema } from './MediaBindingOrderByRelationAggregateInput.schema';
import { MediaOperationOrderByRelationAggregateInputObjectSchema as MediaOperationOrderByRelationAggregateInputObjectSchema } from './MediaOperationOrderByRelationAggregateInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  bucket: SortOrderSchema.optional(),
  storageKey: SortOrderSchema.optional(),
  originalFileName: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  mimeType: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  sizeBytes: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  checksum: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  etag: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  availability: SortOrderSchema.optional(),
  verifiedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  missingAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  bindings: z.lazy(() => MediaBindingOrderByRelationAggregateInputObjectSchema).optional(),
  operations: z.lazy(() => MediaOperationOrderByRelationAggregateInputObjectSchema).optional()
}).strict();
export const MediaObjectOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MediaObjectOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaObjectOrderByWithRelationInput>;
export const MediaObjectOrderByWithRelationInputObjectZodSchema = makeSchema();
