import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.literal(true).optional(),
  mediaObjectId: z.literal(true).optional(),
  ownerType: z.literal(true).optional(),
  ownerId: z.literal(true).optional(),
  role: z.literal(true).optional(),
  sortOrder: z.literal(true).optional(),
  audienceSegment: z.literal(true).optional(),
  lifecycle: z.literal(true).optional(),
  pipelineKey: z.literal(true).optional(),
  createdAt: z.literal(true).optional(),
  updatedAt: z.literal(true).optional()
}).strict();
export const MediaBindingMinAggregateInputObjectSchema: z.ZodType<Prisma.MediaBindingMinAggregateInputType> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingMinAggregateInputType>;
export const MediaBindingMinAggregateInputObjectZodSchema = makeSchema();
