import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { UuidFilterObjectSchema as UuidFilterObjectSchema } from './UuidFilter.schema';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema'

const systemjobrunlogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemJobRunLogWhereInputObjectSchema), z.lazy(() => SystemJobRunLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemJobRunLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemJobRunLogWhereInputObjectSchema), z.lazy(() => SystemJobRunLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => UuidFilterObjectSchema), z.string()]).optional(),
  processorKey: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  triggerSource: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  processedCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  errorCount: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  detail: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  startedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  finishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable()
}).strict();
export const SystemJobRunLogWhereInputObjectSchema: z.ZodType<Prisma.SystemJobRunLogWhereInput> = systemjobrunlogwhereinputSchema as unknown as z.ZodType<Prisma.SystemJobRunLogWhereInput>;
export const SystemJobRunLogWhereInputObjectZodSchema = systemjobrunlogwhereinputSchema;
