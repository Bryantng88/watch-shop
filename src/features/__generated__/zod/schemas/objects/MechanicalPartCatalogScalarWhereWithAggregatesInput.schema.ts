import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumMechanicalPartGroupWithAggregatesFilterObjectSchema as EnumMechanicalPartGroupWithAggregatesFilterObjectSchema } from './EnumMechanicalPartGroupWithAggregatesFilter.schema';
import { MechanicalPartGroupSchema } from '../enums/MechanicalPartGroup.schema';
import { DecimalNullableWithAggregatesFilterObjectSchema as DecimalNullableWithAggregatesFilterObjectSchema } from './DecimalNullableWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { IntWithAggregatesFilterObjectSchema as IntWithAggregatesFilterObjectSchema } from './IntWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const mechanicalpartcatalogscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  code: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  group: z.union([z.lazy(() => EnumMechanicalPartGroupWithAggregatesFilterObjectSchema), MechanicalPartGroupSchema]).optional(),
  defaultCost: z.union([z.lazy(() => DecimalNullableWithAggregatesFilterObjectSchema), z.number()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  sortOrder: z.union([z.lazy(() => IntWithAggregatesFilterObjectSchema), z.number().int()]).optional(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional()
}).strict();
export const MechanicalPartCatalogScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.MechanicalPartCatalogScalarWhereWithAggregatesInput> = mechanicalpartcatalogscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.MechanicalPartCatalogScalarWhereWithAggregatesInput>;
export const MechanicalPartCatalogScalarWhereWithAggregatesInputObjectZodSchema = mechanicalpartcatalogscalarwherewithaggregatesinputSchema;
