import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumVendorRoleFilterObjectSchema as EnumVendorRoleFilterObjectSchema } from './EnumVendorRoleFilter.schema';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema'

const vendorscalarwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => VendorScalarWhereInputObjectSchema), z.lazy(() => VendorScalarWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => VendorScalarWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => VendorScalarWhereInputObjectSchema), z.lazy(() => VendorScalarWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumVendorRoleFilterObjectSchema), VendorRoleSchema]).optional(),
  isAuthorized: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  bankName: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  bankAcc: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable()
}).strict();
export const VendorScalarWhereInputObjectSchema: z.ZodType<Prisma.VendorScalarWhereInput> = vendorscalarwhereinputSchema as unknown as z.ZodType<Prisma.VendorScalarWhereInput>;
export const VendorScalarWhereInputObjectZodSchema = vendorscalarwhereinputSchema;
