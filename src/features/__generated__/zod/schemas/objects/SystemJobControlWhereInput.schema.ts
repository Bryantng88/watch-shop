import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const systemjobcontrolwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => SystemJobControlWhereInputObjectSchema), z.lazy(() => SystemJobControlWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => SystemJobControlWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => SystemJobControlWhereInputObjectSchema), z.lazy(() => SystemJobControlWhereInputObjectSchema).array()]).optional(),
  key: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  label: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  enabled: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  batchSize: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  pausedReason: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  metadata: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  updated_at: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updated_by: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const SystemJobControlWhereInputObjectSchema: z.ZodType<Prisma.SystemJobControlWhereInput> = systemjobcontrolwhereinputSchema as unknown as z.ZodType<Prisma.SystemJobControlWhereInput>;
export const SystemJobControlWhereInputObjectZodSchema = systemjobcontrolwhereinputSchema;
