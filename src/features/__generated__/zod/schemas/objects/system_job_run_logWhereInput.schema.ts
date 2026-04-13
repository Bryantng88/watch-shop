import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const system_job_run_logwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => system_job_run_logWhereInputObjectSchema), z.lazy(() => system_job_run_logWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => system_job_run_logWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => system_job_run_logWhereInputObjectSchema), z.lazy(() => system_job_run_logWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  processor_key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  trigger_source: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  processed_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  error_count: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  detail: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  started_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  finished_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const system_job_run_logWhereInputObjectSchema: z.ZodType<Prisma.system_job_run_logWhereInput> = system_job_run_logwhereinputSchema as unknown as z.ZodType<Prisma.system_job_run_logWhereInput>;
export const system_job_run_logWhereInputObjectZodSchema = system_job_run_logwhereinputSchema;
