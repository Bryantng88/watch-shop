import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  ownerType: MediaOwnerTypeSchema,
  ownerId: z.string(),
  role: MediaRoleSchema,
  sortOrder: z.number().int().optional(),
  audienceSegment: AudienceSegmentSchema,
  lifecycle: MediaBindingLifecycleSchema.optional(),
  pipelineKey: MediaPipelineKeySchema.optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();
export const MediaBindingCreateWithoutMediaObjectInputObjectSchema: z.ZodType<Prisma.MediaBindingCreateWithoutMediaObjectInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingCreateWithoutMediaObjectInput>;
export const MediaBindingCreateWithoutMediaObjectInputObjectZodSchema = makeSchema();
