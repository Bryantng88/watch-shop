import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumTimelineContainerTypeFilterObjectSchema as EnumTimelineContainerTypeFilterObjectSchema } from './EnumTimelineContainerTypeFilter.schema';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { EnumTimelineSourceTypeFilterObjectSchema as EnumTimelineSourceTypeFilterObjectSchema } from './EnumTimelineSourceTypeFilter.schema';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema'

const timelineentrywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TimelineEntryWhereInputObjectSchema), z.lazy(() => TimelineEntryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TimelineEntryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TimelineEntryWhereInputObjectSchema), z.lazy(() => TimelineEntryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  containerType: z.union([z.lazy(() => EnumTimelineContainerTypeFilterObjectSchema), TimelineContainerTypeSchema]).optional(),
  containerId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sourceType: z.union([z.lazy(() => EnumTimelineSourceTypeFilterObjectSchema), TimelineSourceTypeSchema]).optional(),
  sourceId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  occurredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  bodySnapshot: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  visibility: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TimelineEntryWhereInputObjectSchema: z.ZodType<Prisma.TimelineEntryWhereInput> = timelineentrywhereinputSchema as unknown as z.ZodType<Prisma.TimelineEntryWhereInput>;
export const TimelineEntryWhereInputObjectZodSchema = timelineentrywhereinputSchema;
