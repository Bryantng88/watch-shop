import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOperationTypeSchema } from '../enums/MediaOperationType.schema';
import { MediaOperationStatusSchema } from '../enums/MediaOperationStatus.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  idempotencyKey: z.string(),
  mediaObjectId: z.string().optional().nullable(),
  type: MediaOperationTypeSchema,
  status: MediaOperationStatusSchema.optional(),
  sourceKey: z.string().optional().nullable(),
  destinationKey: z.string().optional().nullable(),
  attempts: z.number().int().optional(),
  lastError: z.string().optional().nullable(),
  requestedByUserId: z.string().optional().nullable(),
  startedAt: z.coerce.date().optional().nullable(),
  completedAt: z.coerce.date().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const MediaOperationCreateManyInputObjectSchema: z.ZodType<Prisma.MediaOperationCreateManyInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaOperationCreateManyInput>;
export const MediaOperationCreateManyInputObjectZodSchema = makeSchema();
