import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const system_job_controlwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => system_job_controlWhereInputObjectSchema), z.lazy(() => system_job_controlWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => system_job_controlWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => system_job_controlWhereInputObjectSchema), z.lazy(() => system_job_controlWhereInputObjectSchema).array()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  label: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  batch_size: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  paused_reason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const system_job_controlWhereInputObjectSchema: z.ZodType<Prisma.system_job_controlWhereInput> = system_job_controlwhereinputSchema as unknown as z.ZodType<Prisma.system_job_controlWhereInput>;
export const system_job_controlWhereInputObjectZodSchema = system_job_controlwhereinputSchema;
