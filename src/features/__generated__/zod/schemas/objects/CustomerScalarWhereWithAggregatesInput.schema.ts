import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const customerscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => CustomerScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CustomerScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => CustomerScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => CustomerScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => CustomerScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  email: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string().max(32)]).optional().nullable(),
  ward: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  city: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  userId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  address: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  district: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const CustomerScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.CustomerScalarWhereWithAggregatesInput> = customerscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.CustomerScalarWhereWithAggregatesInput>;
export const CustomerScalarWhereWithAggregatesInputObjectZodSchema = customerscalarwherewithaggregatesinputSchema;
