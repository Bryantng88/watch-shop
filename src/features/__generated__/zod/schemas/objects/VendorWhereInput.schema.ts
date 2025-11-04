import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { StringFilterObjectSchema as StringFilterObjectSchema } from './StringFilter.schema';
import { EnumVendorRoleFilterObjectSchema as EnumVendorRoleFilterObjectSchema } from './EnumVendorRoleFilter.schema';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { BoolFilterObjectSchema as BoolFilterObjectSchema } from './BoolFilter.schema';
import { StringNullableFilterObjectSchema as StringNullableFilterObjectSchema } from './StringNullableFilter.schema';
import { DateTimeFilterObjectSchema as DateTimeFilterObjectSchema } from './DateTimeFilter.schema';
import { AcquisitionListRelationFilterObjectSchema as AcquisitionListRelationFilterObjectSchema } from './AcquisitionListRelationFilter.schema';
import { InvoiceListRelationFilterObjectSchema as InvoiceListRelationFilterObjectSchema } from './InvoiceListRelationFilter.schema';
import { MaintenanceRecordListRelationFilterObjectSchema as MaintenanceRecordListRelationFilterObjectSchema } from './MaintenanceRecordListRelationFilter.schema';
import { ProductListRelationFilterObjectSchema as ProductListRelationFilterObjectSchema } from './ProductListRelationFilter.schema'

const vendorwhereinputSchema = z.object({
  AND: z.union([z.lazy(() => VendorWhereInputObjectSchema), z.lazy(() => VendorWhereInputObjectSchema).array()]).optional(),
  OR: z.lazy(() => VendorWhereInputObjectSchema).array().optional(),
  NOT: z.union([z.lazy(() => VendorWhereInputObjectSchema), z.lazy(() => VendorWhereInputObjectSchema).array()]).optional(),
  id: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  name: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  role: z.union([z.lazy(() => EnumVendorRoleFilterObjectSchema), VendorRoleSchema]).optional(),
  isAuthorized: z.union([z.lazy(() => BoolFilterObjectSchema), z.boolean()]).optional(),
  email: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  phone: z.union([z.lazy(() => StringFilterObjectSchema), z.string()]).optional(),
  address: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  note: z.union([z.lazy(() => StringNullableFilterObjectSchema), z.string()]).optional().nullable(),
  createdAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  updatedAt: z.union([z.lazy(() => DateTimeFilterObjectSchema), z.coerce.date()]).optional(),
  acquisitions: z.lazy(() => AcquisitionListRelationFilterObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceListRelationFilterObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordListRelationFilterObjectSchema).optional(),
  Product: z.lazy(() => ProductListRelationFilterObjectSchema).optional()
}).strict();
export const VendorWhereInputObjectSchema: z.ZodType<Prisma.VendorWhereInput> = vendorwhereinputSchema as unknown as z.ZodType<Prisma.VendorWhereInput>;
export const VendorWhereInputObjectZodSchema = vendorwhereinputSchema;
