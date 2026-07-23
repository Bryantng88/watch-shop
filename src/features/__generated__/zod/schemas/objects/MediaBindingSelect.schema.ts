import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectArgsObjectSchema as MediaObjectArgsObjectSchema } from './MediaObjectArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  mediaObjectId: z.boolean().optional(),
  ownerType: z.boolean().optional(),
  ownerId: z.boolean().optional(),
  role: z.boolean().optional(),
  sortOrder: z.boolean().optional(),
  audienceSegment: z.boolean().optional(),
  lifecycle: z.boolean().optional(),
  pipelineKey: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  mediaObject: z.union([z.boolean(), z.lazy(() => MediaObjectArgsObjectSchema)]).optional()
}).strict();
export const MediaBindingSelectObjectSchema: z.ZodType<Prisma.MediaBindingSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingSelect>;
export const MediaBindingSelectObjectZodSchema = makeSchema();
