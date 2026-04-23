import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { JsonNullableFilterObjectSchema as JsonNullableFilterObjectSchema } from './JsonNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionSpecJobScalarRelationFilterObjectSchema as AcquisitionSpecJobScalarRelationFilterObjectSchema } from './AcquisitionSpecJobScalarRelationFilter.schema';
import { AcquisitionSpecJobWhereInputObjectSchema as AcquisitionSpecJobWhereInputObjectSchema } from './AcquisitionSpecJobWhereInput.schema'

const acquisitionspecjoblogwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionSpecJobId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  stage: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  message: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  payload: z.lazy(() => JsonNullableFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  acquisitionSpecJob: z.union([z.lazy(() => AcquisitionSpecJobScalarRelationFilterObjectSchema), z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema)]).optional()
}).strict();
export const AcquisitionSpecJobLogWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogWhereInput> = acquisitionspecjoblogwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogWhereInput>;
export const AcquisitionSpecJobLogWhereInputObjectZodSchema = acquisitionspecjoblogwhereinputSchema;
