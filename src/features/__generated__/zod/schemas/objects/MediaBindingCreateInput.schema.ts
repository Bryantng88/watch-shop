import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { MediaObjectCreateNestedOneWithoutBindingsInputObjectSchema as MediaObjectCreateNestedOneWithoutBindingsInputObjectSchema } from './MediaObjectCreateNestedOneWithoutBindingsInput.schema'

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
  mediaObject: z.lazy(() => MediaObjectCreateNestedOneWithoutBindingsInputObjectSchema)
}).strict();
export const MediaBindingCreateInputObjectSchema: z.ZodType<Prisma.MediaBindingCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.MediaBindingCreateInput>;
export const MediaBindingCreateInputObjectZodSchema = makeSchema();
