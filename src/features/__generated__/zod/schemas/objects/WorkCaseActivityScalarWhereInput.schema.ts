import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const workcaseactivityscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema), z.lazy(() => WorkCaseActivityScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workCaseId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  actorId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  action: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const WorkCaseActivityScalarWhereInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityScalarWhereInput> = workcaseactivityscalarwhereinputSchema as unknown as z.ZodType<Prisma.WorkCaseActivityScalarWhereInput>;
export const WorkCaseActivityScalarWhereInputObjectZodSchema = workcaseactivityscalarwhereinputSchema;
