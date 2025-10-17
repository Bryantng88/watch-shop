import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { IntNullableFilterObjectSchema as IntNullableFilterObjectSchema } from './IntNullableFilter.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const servicecatalogscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema), z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema), z.lazy(() => ServiceCatalogScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  defaultPrice: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  durationMin: z.union([z.lazy(() => IntNullableFilterObjectSchema), z.number().int()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  maintenanceRecordId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const ServiceCatalogScalarWhereInputObjectSchema: z.ZodType<Prisma.ServiceCatalogScalarWhereInput> = servicecatalogscalarwhereinputSchema as unknown as z.ZodType<Prisma.ServiceCatalogScalarWhereInput>;
export const ServiceCatalogScalarWhereInputObjectZodSchema = servicecatalogscalarwhereinputSchema;
