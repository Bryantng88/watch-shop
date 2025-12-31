import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { IntNullableWithAggregatesFilterObjectSchema as IntNullableWithAggregatesFilterObjectSchema } from './IntNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema';
import { EnumServiceDetailWithAggregatesFilterObjectSchema as EnumServiceDetailWithAggregatesFilterObjectSchema } from './EnumServiceDetailWithAggregatesFilter.schema';
import { ServiceDetailSchema } from '../enums/ServiceDetail.schema'

const servicecatalogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => ServiceCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ServiceCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => ServiceCatalogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => ServiceCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => ServiceCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  description: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  defaultPrice: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  durationMin: z.union([z.lazy(() => IntNullableWithAggregatesFilterObjectSchema), z.number().int()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  maintenanceRecordId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  detail: z.union([z.lazy(() => EnumServiceDetailWithAggregatesFilterObjectSchema), ServiceDetailSchema]).optional()
}).strict();
export const ServiceCatalogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.ServiceCatalogScalarWhereWithAggregatesInput> = servicecatalogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.ServiceCatalogScalarWhereWithAggregatesInput>;
export const ServiceCatalogScalarWhereWithAggregatesInputObjectZodSchema = servicecatalogscalarwherewithaggregatesinputSchema;
