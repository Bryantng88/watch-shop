import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const acquisitionspecjoblogscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionSpecJobId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  stage: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  message: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  payload: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AcquisitionSpecJobLogScalarWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogScalarWhereInput> = acquisitionspecjoblogscalarwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogScalarWhereInput>;
export const AcquisitionSpecJobLogScalarWhereInputObjectZodSchema = acquisitionspecjoblogscalarwhereinputSchema;
