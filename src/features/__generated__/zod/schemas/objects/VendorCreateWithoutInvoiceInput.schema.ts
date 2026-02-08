import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutVendorInput.schema';
import { ProductCreateNestedManyWithoutVendorInputObjectSchema as ProductCreateNestedManyWithoutVendorInputObjectSchema } from './ProductCreateNestedManyWithoutVendorInput.schema';
import { ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema as ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema } from './ServiceRequestCreateNestedManyWithoutVendorInput.schema';
import { BankCreateNestedOneWithoutVendorInputObjectSchema as BankCreateNestedOneWithoutVendorInputObjectSchema } from './BankCreateNestedOneWithoutVendorInput.schema'

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
  bankAcc: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  acquisitions: z.lazy(() => AcquisitionCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  ServiceRequest: z.lazy(() => ServiceRequestCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Bank: z.lazy(() => BankCreateNestedOneWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorCreateWithoutInvoiceInputObjectSchema: z.ZodType<Prisma.VendorCreateWithoutInvoiceInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateWithoutInvoiceInput>;
export const VendorCreateWithoutInvoiceInputObjectZodSchema = makeSchema();
