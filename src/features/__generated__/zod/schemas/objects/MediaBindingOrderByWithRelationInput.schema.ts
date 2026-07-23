import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { SortOrderSchema } from '../enums/SortOrder.schema';
import { SortOrderInputObjectSchema as SortOrderInputObjectSchema } from './SortOrderInput.schema';
import { MediaObjectOrderByWithRelationInputObjectSchema as MediaObjectOrderByWithRelationInputObjectSchema } from './MediaObjectOrderByWithRelationInput.schema'

const makeSchema = () => z.object({
  id: SortOrderSchema.optional(),
  mediaObjectId: SortOrderSchema.optional(),
  ownerType: SortOrderSchema.optional(),
  ownerId: SortOrderSchema.optional(),
  role: SortOrderSchema.optional(),
  sortOrder: SortOrderSchema.optional(),
  audienceSegment: SortOrderSchema.optional(),
  lifecycle: SortOrderSchema.optional(),
  pipelineKey: z.union([SortOrderSchema, z.lazy(() => SortOrderInputObjectSchema)]).optional(),
  createdAt: SortOrderSchema.optional(),
  updatedAt: SortOrderSchema.optional(),
  mediaObject: z.lazy(() => MediaObjectOrderByWithRelationInputObjectSchema).optional()
}).strict();
export const MediaBindingOrderByWithRelationInputObjectSchema: z.ZodType<Prisma.MediaBindingOrderByWithRelationInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingOrderByWithRelationInput>;
export const MediaBindingOrderByWithRelationInputObjectZodSchema = makeSchema();
