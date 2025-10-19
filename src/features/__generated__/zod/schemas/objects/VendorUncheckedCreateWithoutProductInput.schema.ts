import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionUncheckedCreateNestedManyWithoutVendorInput.schema';
import { InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema as InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceUncheckedCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInput.schema'

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
  updatedAt: z.coerce.date().optional(),
  acquisitions: z.lazy(() => AcquisitionUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Invoice: z.lazy(() => InvoiceUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordUncheckedCreateNestedManyWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorUncheckedCreateWithoutProductInputObjectSchema: z.ZodType<Prisma.VendorUncheckedCreateWithoutProductInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorUncheckedCreateWithoutProductInput>;
export const VendorUncheckedCreateWithoutProductInputObjectZodSchema = makeSchema();
