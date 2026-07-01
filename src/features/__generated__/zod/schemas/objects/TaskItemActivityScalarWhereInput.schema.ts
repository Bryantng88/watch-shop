import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumActivitySourceTypeFilterObjectSchema as EnumActivitySourceTypeFilterObjectSchema } from './EnumActivitySourceTypeFilter.schema';
import { ActivitySourceTypeSchema } from '../enums/ActivitySourceType.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumActivityStatusFilterObjectSchema as EnumActivityStatusFilterObjectSchema } from './EnumActivityStatusFilter.schema';
import { ActivityStatusSchema } from '../enums/ActivityStatus.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskitemactivityscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  taskItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  sourceType: z.union([z.lazy(() => EnumActivitySourceTypeFilterObjectSchema), ActivitySourceTypeSchema]).optional(),
  sourceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  title: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  body: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => EnumActivityStatusFilterObjectSchema), ActivityStatusSchema]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  occurredAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskItemActivityScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskItemActivityScalarWhereInput> = taskitemactivityscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityScalarWhereInput>;
export const TaskItemActivityScalarWhereInputObjectZodSchema = taskitemactivityscalarwhereinputSchema;
