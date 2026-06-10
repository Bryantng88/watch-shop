import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { EnumWorkCaseScopeFilterObjectSchema as EnumWorkCaseScopeFilterObjectSchema } from './EnumWorkCaseScopeFilter.schema';
import { WorkCaseScopeSchema } from '../enums/WorkCaseScope.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { WorkCaseListRelationFilterObjectSchema as WorkCaseListRelationFilterObjectSchema } from './WorkCaseListRelationFilter.schema'

const workcasecategorywhereinputSchema = z.object({
  AND: z.union([z.lazy(() => WorkCaseCategoryWhereInputObjectSchema), z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => WorkCaseCategoryWhereInputObjectSchema), z.lazy(() => WorkCaseCategoryWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  scope: z.union([z.lazy(() => EnumWorkCaseScopeFilterObjectSchema), WorkCaseScopeSchema]).optional(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  workCases: z.lazy(() => WorkCaseListRelationFilterObjectSchema).optional()
}).strict();
export const WorkCaseCategoryWhereInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryWhereInput> = workcasecategorywhereinputSchema as unknown as z.ZodType<Prisma.WorkCaseCategoryWhereInput>;
export const WorkCaseCategoryWhereInputObjectZodSchema = workcasecategorywhereinputSchema;
