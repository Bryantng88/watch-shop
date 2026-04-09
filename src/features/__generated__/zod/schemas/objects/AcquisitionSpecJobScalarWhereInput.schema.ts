import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const acquisitionspecjobscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attempts: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  lastError: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  finishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AcquisitionSpecJobScalarWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobScalarWhereInput> = acquisitionspecjobscalarwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionSpecJobScalarWhereInput>;
export const AcquisitionSpecJobScalarWhereInputObjectZodSchema = acquisitionspecjobscalarwhereinputSchema;
