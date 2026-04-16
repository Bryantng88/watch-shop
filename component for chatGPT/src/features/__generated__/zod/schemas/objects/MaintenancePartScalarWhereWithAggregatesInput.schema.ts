import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema'

const maintenancepartscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MaintenancePartScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MaintenancePartScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MaintenancePartScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MaintenancePartScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  recordId: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  variantId: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  quantity: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  unitCost: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  notes: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const MaintenancePartScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MaintenancePartScalarWhereWithAggregatesInput> = maintenancepartscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MaintenancePartScalarWhereWithAggregatesInput>;
export const MaintenancePartScalarWhereWithAggregatesInputObjectZodSchema = maintenancepartscalarwherewithaggregatesinputSchema;
