import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateNestedManyWithoutVendorInput.schema';
import { InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInput.schema';
import { ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema as ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './ProductUncheckedCreateNestedManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  role: VendorRoleSchema.optional(),
  isAuthorized: z.boolean().optional(),
  email: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  bankName: z.string().optional().nullable(),
  bankAcc: z.string().optional().nullable(),
  acquisitions: z.lazy(() => AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema),
  invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema),
  services: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema),
  Product: z.lazy(() => ProductUncheckedCreateNestedManyWithoutVendorInputObjectSchema)
}).strict();
export const VendorUncheckedCreateInputObjectSchema: z.ZodType<Prisma.VendorUncheckedCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedCreateInput>;
export const VendorUncheckedCreateInputObjectZodSchema = makeSchema();
