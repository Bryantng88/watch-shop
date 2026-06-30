import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumTimelineContainerTypeWithAggregatesFilterObjectSchema as EnumTimelineContainerTypeWithAggregatesFilterObjectSchema } from './EnumTimelineContainerTypeWithAggregatesFilter.schema';
import { TimelineContainerTypeSchema } from '../enums/TimelineContainerType.schema';
import { EnumTimelineSourceTypeWithAggregatesFilterObjectSchema as EnumTimelineSourceTypeWithAggregatesFilterObjectSchema } from './EnumTimelineSourceTypeWithAggregatesFilter.schema';
import { TimelineSourceTypeSchema } from '../enums/TimelineSourceType.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema'

const timelineentryscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TimelineEntryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TimelineEntryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TimelineEntryScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TimelineEntryScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TimelineEntryScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  containerType: z.union([z.lazy(() => EnumTimelineContainerTypeWithAggregatesFilterObjectSchema), TimelineContainerTypeSchema]).optional(),
  containerId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  sourceType: z.union([z.lazy(() => EnumTimelineSourceTypeWithAggregatesFilterObjectSchema), TimelineSourceTypeSchema]).optional(),
  sourceId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  occurredAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  bodySnapshot: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  visibility: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TimelineEntryScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TimelineEntryScalarWhereWithAggregatesInput> = timelineentryscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TimelineEntryScalarWhereWithAggregatesInput>;
export const TimelineEntryScalarWhereWithAggregatesInputObjectZodSchema = timelineentryscalarwherewithaggregatesinputSchema;
