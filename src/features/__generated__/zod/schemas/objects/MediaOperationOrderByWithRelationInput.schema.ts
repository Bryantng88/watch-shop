import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaObjectOrderByWithRelationInputObjectSchema as MediaObjectOrderByWithRelationInputObjectSchema } from './MediaObjectOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  idempotencyKey: SortOrderSchema.optional(),
  mediaObjectId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  type: SortOrderSchema.optional(),
  status: SortOrderSchema.optional(),
  sourceKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  destinationKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  attempts: SortOrderSchema.optional(),
  lastError: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  requestedByUserId: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  startedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  completedAt: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  mediaObject: z.lazy(() => MediaObjectOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const MediaOperationOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MediaOperationOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationOrderByWithRelationInput>;
export const MediaOperationOrderByWithRelationInputObjectZodSchema = makeSchema();
