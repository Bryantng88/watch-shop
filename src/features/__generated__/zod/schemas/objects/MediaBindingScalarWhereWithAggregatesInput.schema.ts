import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumMediaOwnerTypeWithAggregatesFilterObjectSchema as EnumMediaOwnerTypeWithAggregatesFilterObjectSchema } from './EnumMediaOwnerTypeWithAggregatesFilter.schema';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { EnumMediaRoleWithAggregatesFilterObjectSchema as EnumMediaRoleWithAggregatesFilterObjectSchema } from './EnumMediaRoleWithAggregatesFilter.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { EnumAudienceSegmentWithAggregatesFilterObjectSchema as EnumAudienceSegmentWithAggregatesFilterObjectSchema } from './EnumAudienceSegmentWithAggregatesFilter.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { EnumMediaBindingLifecycleWithAggregatesFilterObjectSchema as EnumMediaBindingLifecycleWithAggregatesFilterObjectSchema } from './EnumMediaBindingLifecycleWithAggregatesFilter.schema';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { EnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema as EnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema } from './EnumMediaPipelineKeyNullableWithAggregatesFilter.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const mediabindingscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaBindingScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaBindingScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaBindingScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaBindingScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MediaBindingScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  mediaObjectId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  ownerType: z.union([z.lazy(() => EnumMediaOwnerTypeWithAggregatesFilterObjectSchema), MediaOwnerTypeSchema]).optional(),
  ownerId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumMediaRoleWithAggregatesFilterObjectSchema), MediaRoleSchema]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  audienceSegment: z.union([z.lazy(() => EnumAudienceSegmentWithAggregatesFilterObjectSchema), AudienceSegmentSchema]).optional(),
  lifecycle: z.union([z.lazy(() => EnumMediaBindingLifecycleWithAggregatesFilterObjectSchema), MediaBindingLifecycleSchema]).optional(),
  pipelineKey: z.union([z.lazy(() => EnumMediaPipelineKeyNullableWithAggregatesFilterObjectSchema), MediaPipelineKeySchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaBindingScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MediaBindingScalarWhereWithAggregatesInput> = mediabindingscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MediaBindingScalarWhereWithAggregatesInput>;
export const MediaBindingScalarWhereWithAggregatesInputObjectZodSchema = mediabindingscalarwherewithaggregatesinputSchema;
