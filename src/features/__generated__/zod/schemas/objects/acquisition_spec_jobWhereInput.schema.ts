import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const acquisition_spec_jobwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => acquisition_spec_jobWhereInputObjectSchema), z.lazy(() => acquisition_spec_jobWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => acquisition_spec_jobWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => acquisition_spec_jobWhereInputObjectSchema), z.lazy(() => acquisition_spec_jobWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  acquisition_item_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  product_id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attempts: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  last_error: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  priority: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  run_after: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  started_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  finished_at: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  created_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const acquisition_spec_jobWhereInputObjectSchema: z.ZodType<Prisma.acquisition_spec_jobWhereInput> = acquisition_spec_jobwhereinputSchema as unknown as z.ZodType<Prisma.acquisition_spec_jobWhereInput>;
export const acquisition_spec_jobWhereInputObjectZodSchema = acquisition_spec_jobwhereinputSchema;
