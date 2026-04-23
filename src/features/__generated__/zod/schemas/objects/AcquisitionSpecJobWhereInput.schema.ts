import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeNullableFilterObjectSchema as DateTimeNullableFilterObjectSchema } from './DateTimeNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionItemScalarRelationFilterObjectSchema as AcquisitionItemScalarRelationFilterObjectSchema } from './AcquisitionItemScalarRelationFilter.schema';
import { AcquisitionItemWhereInputObjectSchema as AcquisitionItemWhereInputObjectSchema } from './AcquisitionItemWhereInput.schema';
import { ProductScalarRelationFilterObjectSchema as ProductScalarRelationFilterObjectSchema } from './ProductScalarRelationFilter.schema';
import { ProductWhereInputObjectSchema as ProductWhereInputObjectSchema } from './ProductWhereInput.schema';
import { AcquisitionSpecJobLogListRelationFilterObjectSchema as AcquisitionSpecJobLogListRelationFilterObjectSchema } from './AcquisitionSpecJobLogListRelationFilter.schema'

const acquisitionspecjobwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema), z.lazy(() => AcquisitionSpecJobWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  acquisitionItemId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  productId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  status: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  attempts: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  lastError: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  startedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  finishedAt: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  runAfter: z.union([z.lazy(() => DateTimeNullableFilterObjectSchema), z.coerce.date()]).optional().nullable(),
  priority: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  acquisitionItem: z.union([z.lazy(() => AcquisitionItemScalarRelationFilterObjectSchema), z.lazy(() => AcquisitionItemWhereInputObjectSchema)]).optional(),
  product: z.union([z.lazy(() => ProductScalarRelationFilterObjectSchema), z.lazy(() => ProductWhereInputObjectSchema)]).optional(),
  logs: z.lazy(() => AcquisitionSpecJobLogListRelationFilterObjectSchema).optional()
}).strict();
export const AcquisitionSpecJobWhereInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobWhereInput> = acquisitionspecjobwhereinputSchema as unknown as z.ZodType<Prisma.AcquisitionSpecJobWhereInput>;
export const AcquisitionSpecJobWhereInputObjectZodSchema = acquisitionspecjobwhereinputSchema;
