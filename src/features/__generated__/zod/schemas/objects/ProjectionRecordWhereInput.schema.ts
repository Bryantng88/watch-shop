import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { JsonFilterObjectSchema as JsonFilterObjectSchema } from './JsonFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const projectionrecordwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ProjectionRecordWhereInputObjectSchema), z.lazy(() => ProjectionRecordWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ProjectionRecordWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ProjectionRecordWhereInputObjectSchema), z.lazy(() => ProjectionRecordWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  projectionKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  projectionVersion: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  rowKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  workspaceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  spaceId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  entityType: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  entityId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  status: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  searchText: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  sortAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  dataJson: z.lazy(() => JsonFilterObjectSchema).optional(),
  sourceUpdatedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  projectedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const ProjectionRecordWhereInputObjectSchema: z.ZodType<Prisma.ProjectionRecordWhereInput> = projectionrecordwhereinputSchema as unknown as z.ZodType<Prisma.ProjectionRecordWhereInput>;
export const ProjectionRecordWhereInputObjectZodSchema = projectionrecordwhereinputSchema;
