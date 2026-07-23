import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumMediaOwnerTypeFilterObjectSchema as EnumMediaOwnerTypeFilterObjectSchema } from './EnumMediaOwnerTypeFilter.schema';
import { MediaOwnerTypeSchema } from '../enums/MediaOwnerType.schema';
import { EnumMediaRoleFilterObjectSchema as EnumMediaRoleFilterObjectSchema } from './EnumMediaRoleFilter.schema';
import { MediaRoleSchema } from '../enums/MediaRole.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { EnumAudienceSegmentFilterObjectSchema as EnumAudienceSegmentFilterObjectSchema } from './EnumAudienceSegmentFilter.schema';
import { AudienceSegmentSchema } from '../enums/AudienceSegment.schema';
import { EnumMediaBindingLifecycleFilterObjectSchema as EnumMediaBindingLifecycleFilterObjectSchema } from './EnumMediaBindingLifecycleFilter.schema';
import { MediaBindingLifecycleSchema } from '../enums/MediaBindingLifecycle.schema';
import { EnumMediaPipelineKeyNullableFilterObjectSchema as EnumMediaPipelineKeyNullableFilterObjectSchema } from './EnumMediaPipelineKeyNullableFilter.schema';
import { MediaPipelineKeySchema } from '../enums/MediaPipelineKey.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const mediabindingscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MediaBindingScalarWhereInputObjectSchema), z.lazy(() => MediaBindingScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MediaBindingScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MediaBindingScalarWhereInputObjectSchema), z.lazy(() => MediaBindingScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  mediaObjectId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  ownerType: z.union([z.lazy(() => EnumMediaOwnerTypeFilterObjectSchema), MediaOwnerTypeSchema]).optional(),
  ownerId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumMediaRoleFilterObjectSchema), MediaRoleSchema]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  audienceSegment: z.union([z.lazy(() => EnumAudienceSegmentFilterObjectSchema), AudienceSegmentSchema]).optional(),
  lifecycle: z.union([z.lazy(() => EnumMediaBindingLifecycleFilterObjectSchema), MediaBindingLifecycleSchema]).optional(),
  pipelineKey: z.union([z.lazy(() => EnumMediaPipelineKeyNullableFilterObjectSchema), MediaPipelineKeySchema]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MediaBindingScalarWhereInputObjectSchema: z.ZodType<Prisma.MediaBindingScalarWhereInput> = mediabindingscalarwhereinputSchema as unknown as z.ZodType<Prisma.MediaBindingScalarWhereInput>;
export const MediaBindingScalarWhereInputObjectZodSchema = mediabindingscalarwhereinputSchema;
