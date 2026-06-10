import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkCaseScalarRelationFilterObjectSchema as WorkCaseScalarRelationFilterObjectSchema } from './WorkCaseScalarRelationFilter.schema';
import { WorkCaseWhereInputObjectSchema as WorkCaseWhereInputObjectSchema } from './WorkCaseWhereInput.schema';
import { UserNullableScalarRelationFilterObjectSchema as UserNullableScalarRelationFilterObjectSchema } from './UserNullableScalarRelationFilter.schema';
import { UserWhereInputObjectSchema as UserWhereInputObjectSchema } from './UserWhereInput.schema'

const workcaseactivitywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseActivityWhereInputObjectSchema), z.lazy(() => WorkCaseActivityWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseActivityWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseActivityWhereInputObjectSchema), z.lazy(() => WorkCaseActivityWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workCaseId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workCase: z.union([z.lazy(() => WorkCaseScalarRelationFilterObjectSchema), z.lazy(() => WorkCaseWhereInputObjectSchema)]).optional(),
  actor: z.union([z.lazy(() => UserNullableScalarRelationFilterObjectSchema), z.lazy(() => UserWhereInputObjectSchema)]).optional()
}).strict();
export const WorkCaseActivityWhereInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityWhereInput> = workcaseactivitywhereinputSchema as unknown as z.ZodType<Prisma.WorkCaseActivityWhereInput>;
export const WorkCaseActivityWhereInputObjectZodSchema = workcaseactivitywhereinputSchema;
