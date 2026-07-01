import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumActivitySourceTypeWithAggregatesFilterObjectSchema as EnumActivitySourceTypeWithAggregatesFilterObjectSchema } from './EnumActivitySourceTypeWithAggregatesFilter.schema';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { EnumActivityStatusWithAggregatesFilterObjectSchema as EnumActivityStatusWithAggregatesFilterObjectSchema } from './EnumActivityStatusWithAggregatesFilter.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const taskitemactivityscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  taskItemId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  sourceType: z.union([z.lazy(() => EnumActivitySourceTypeWithAggregatesFilterObjectSchema), ActivitySourceTypeSchema]).optional(),
  sourceId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  body: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumActivityStatusWithAggregatesFilterObjectSchema), ActivityStatusSchema]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  occurredAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskItemActivityScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.TaskItemActivityScalarWhereWithAggregatesInput> = taskitemactivityscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityScalarWhereWithAggregatesInput>;
export const TaskItemActivityScalarWhereWithAggregatesInputObjectZodSchema = taskitemactivityscalarwherewithaggregatesinputSchema;
