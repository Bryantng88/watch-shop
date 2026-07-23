import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaObjectArgsObjectSchema as MediaObjectArgsObjectSchema } from './MediaObjectArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  idempotencyKey: z.boolean().optional(),
  mediaObjectId: z.boolean().optional(),
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  sourceKey: z.boolean().optional(),
  destinationKey: z.boolean().optional(),
  attempts: z.boolean().optional(),
  lastError: z.boolean().optional(),
  requestedByUserId: z.boolean().optional(),
  startedAt: z.boolean().optional(),
  completedAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  mediaObject: z.union([z.boolean(), z.lazy(() => MediaObjectArgsObjectSchema)]).optional()
}).strict();
export const MediaOperationSelectObjectSchema: z.ZodType<Prisma.MediaOperationSelect> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationSelect>;
export const MediaOperationSelectObjectZodSchema = makeSchema();
