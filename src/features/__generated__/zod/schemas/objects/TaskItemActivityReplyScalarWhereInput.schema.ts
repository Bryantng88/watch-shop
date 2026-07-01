import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const taskitemactivityreplyscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema), z.lazy(() => TaskItemActivityReplyScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  activityId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorUserId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  body: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  metadataJson: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const TaskItemActivityReplyScalarWhereInputObjectSchema: z.ZodType<Prisma.TaskItemActivityReplyScalarWhereInput> = taskitemactivityreplyscalarwhereinputSchema as unknown as z.ZodType<Prisma.TaskItemActivityReplyScalarWhereInput>;
export const TaskItemActivityReplyScalarWhereInputObjectZodSchema = taskitemactivityreplyscalarwhereinputSchema;
