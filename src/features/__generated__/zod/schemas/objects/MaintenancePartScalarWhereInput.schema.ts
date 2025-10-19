import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { IntFilterObjectSchema as IntFilterObjectSchema } from './IntFilter.schema';
import { DecimalNullableFilterObjectSchema as DecimalNullableFilterObjectSchema } from './DecimalNullableFilter.schema'

const maintenancepartscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MaintenancePartScalarWhereInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  recordId: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  variantId: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableFilterObjectSchema), z.number()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const MaintenancePartScalarWhereInputObjectSchema: z.ZodType<Prisma.MaintenancePartScalarWhereInput> = maintenancepartscalarwhereinputSchema as unknown as z.ZodType<Prisma.MaintenancePartScalarWhereInput>;
export const MaintenancePartScalarWhereInputObjectZodSchema = maintenancepartscalarwhereinputSchema;
