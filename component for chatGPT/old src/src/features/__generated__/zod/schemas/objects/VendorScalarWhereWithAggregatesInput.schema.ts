import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringWithAggregatesFilterObjectSchema as StringWithAggregatesFilterObjectSchema } from './StringWithAggregatesFilter.schema';
import { EnumVendorRoleWithAggregatesFilterObjectSchema as EnumVendorRoleWithAggregatesFilterObjectSchema } from './EnumVendorRoleWithAggregatesFilter.schema';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { BoolWithAggregatesFilterObjectSchema as BoolWithAggregatesFilterObjectSchema } from './BoolWithAggregatesFilter.schema';
import { StringNullableWithAggregatesFilterObjectSchema as StringNullableWithAggregatesFilterObjectSchema } from './StringNullableWithAggregatesFilter.schema';
import { DateTimeWithAggregatesFilterObjectSchema as DateTimeWithAggregatesFilterObjectSchema } from './DateTimeWithAggregatesFilter.schema'

const vendorscalarwherewithaggregatesinputSchema = z.object({
  AND: z.union([z.lazy(() => VendorScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => VendorScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => VendorScalarWhereWithAggregatesInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => VendorScalarWhereWithAggregatesInputObjectSchema), z.lazy(() => VendorScalarWhereWithAggregatesInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringWithAggregatesFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumVendorRoleWithAggregatesFilterObjectSchema), VendorRoleSchema]).optional(),
  isAuthorized: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional(),
  email: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  address: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeWithAggregatesFilterObjectSchema), z.coerce.date()]).optional(),
  bankName: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  bankAcc: z.union([z.lazy(() => StringNullableWithAggregatesFilterObjectSchema), z.string()]).optional().nullable(),
  isActive: z.union([z.lazy(() => BoolWithAggregatesFilterObjectSchema), z.boolean()]).optional()
}).strict();
export const VendorScalarWhereWithAggregatesInputObjectSchema: z.ZodType<Prisma.VendorScalarWhereWithAggregatesInput> = vendorscalarwherewithaggregatesinputSchema as unknown as z.ZodType<Prisma.VendorScalarWhereWithAggregatesInput>;
export const VendorScalarWhereWithAggregatesInputObjectZodSchema = vendorscalarwherewithaggregatesinputSchema;
