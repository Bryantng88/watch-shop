import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema';
import { MaintenanceRecordScalarRelationFilterObjectSchema as MaintenanceRecordScalarRelationFilterObjectSchema } from './MaintenanceRecordScalarRelationFilter.schema';
import { MaintenanceRecordWhereInputObjectSchema as MaintenanceRecordWhereInputObjectSchema } from './MaintenanceRecordWhereInput.schema';
import { ProductVariantNullableScalarRelationFilterObjectSchema as ProductVariantNullableScalarRelationFilterObjectSchema } from './ProductVariantNullableScalarRelationFilter.schema';
import { ProductVariantWhereInputObjectSchema as ProductVariantWhereInputObjectSchema } from './ProductVariantWhereInput.schema'

const maintenancepartwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MaintenancePartWhereInputObjectSchema), z.lazy(() => MaintenancePartWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MaintenancePartWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MaintenancePartWhereInputObjectSchema), z.lazy(() => MaintenancePartWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recordId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  record: z.union([z.lazy(() => MaintenanceRecordScalarRelationFilterObjectSchema), z.lazy(() => MaintenanceRecordWhereInputObjectSchema)]).optional(),
  variant: z.union([z.lazy(() => ProductVariantNullableScalarRelationFilterObjectSchema), z.lazy(() => ProductVariantWhereInputObjectSchema)]).optional()
}).strict();
export const MaintenancePartWhereInputObjectSchema: z.ZodType<Prisma.MaintenancePartWhereInput> = maintenancepartwhereinputSchema as unknown as z.ZodType<Prisma.MaintenancePartWhereInput>;
export const MaintenancePartWhereInputObjectZodSchema = maintenancepartwhereinputSchema;
