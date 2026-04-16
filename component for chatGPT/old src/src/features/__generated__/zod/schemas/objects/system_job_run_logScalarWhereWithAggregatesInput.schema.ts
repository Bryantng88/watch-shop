import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidWithAggregatesFilterObjectSchema as UuidWithAggregatesFilterObjectSchema } from './UuidWithAggregatesFilter.schema';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { DateTimeNullableWithAggregatesFilterObjectSchema as DateTimeNullableWithAggregatesFilterObjectSchema } from './DateTimeNullableWithAggregatesFilter.schema'

const system_job_run_logscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => system_job_run_logScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => system_job_run_logScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => system_job_run_logScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => system_job_run_logScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => system_job_run_logScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidWithAggregatesFilterObjectSchema), z.string()]).optional(),
  processor_key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  trigger_source: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  processed_count: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  error_count: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  detail: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  started_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  finished_at: z.union([z.lazy(() => DateTimeNullableWithAggregatesFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const system_job_run_logScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.system_job_run_logScalarWhereWithAggregatesInput> = system_job_run_logscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.system_job_run_logScalarWhereWithAggregatesInput>;
export const system_job_run_logScalarWhereWithAggregatesInputObjectZodSchema = system_job_run_logscalarwherewithaggregatesinputSchema;
