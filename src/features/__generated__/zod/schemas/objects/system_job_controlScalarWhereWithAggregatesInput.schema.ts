import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const system_job_controlscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => system_job_controlScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => system_job_controlScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => system_job_controlScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => system_job_controlScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => system_job_controlScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  key: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  label: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  batch_size: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  paused_reason: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  updated_at: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updated_by: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const system_job_controlScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.system_job_controlScalarWhereWithAggregatesInput> = system_job_controlscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.system_job_controlScalarWhereWithAggregatesInput>;
export const system_job_controlScalarWhereWithAggregatesInputObjectZodSchema = system_job_controlscalarwherewithaggregatesinputSchema;
