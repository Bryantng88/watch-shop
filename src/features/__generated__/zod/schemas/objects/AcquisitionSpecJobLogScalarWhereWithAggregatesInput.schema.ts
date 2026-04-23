import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { JsonNullableWithAggregatesFilterObjectSchema as JsonNullableWithAggregatesFilterObjectSchema } from './JsonNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const acquisitionspecjoblogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  acquisitionSpecJobId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  acquisitionItemId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  acquisitionId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  productId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  stage: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  level: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  message: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  payload: z.lazy(() => JsonNullableWithAggregatesFilterObjectSchema).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobLogScalarWhereWithAggregatesInput> = acquisitionspecjoblogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.AcquisitionSpecJobLogScalarWhereWithAggregatesInput>;
export const AcquisitionSpecJobLogScalarWhereWithAggregatesInputObjectZodSchema = acquisitionspecjoblogscalarwherewithaggregatesinputSchema;
