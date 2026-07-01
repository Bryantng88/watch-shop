import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskitemactivityreplyscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  activityId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  body: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskItemActivityReplyScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyScalarWhereWithAggregatesInput> = taskitemactivityreplyscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityReplyScalarWhereWithAggregatesInput>;
export const TaskItemActivityReplyScalarWhereWithAggregatesInputObjectZodSchema = taskitemactivityreplyscalarwherewithaggregatesinputSchema;
