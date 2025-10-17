import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionCreateNestedManyWithoutVendorInput.schema';
import { InvoiceCreateNestedManyWithoutVendorInputObjectSchema as InvoiceCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceCreateNestedManyWithoutVendorInput.schema';
import { MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema as MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema } from './MaintenanceRecordCreateNestedManyWithoutVendorInput.schema';
import { ProductCreateNestedManyWithoutVendorInputObjectSchema as ProductCreateNestedManyWithoutVendorInputObjectSchema } from './ProductCreateNestedManyWithoutVendorInput.schema'

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
  acquisitions: z.lazy(() => AcquisitionCreateNestedManyWithoutVendorInputObjectSchema),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutVendorInputObjectSchema),
  services: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema),
  Product: z.lazy(() => ProductCreateNestedManyWithoutVendorInputObjectSchema)
}).strict();
export const VendorCreateInputObjectSchema: z.ZodType<Prisma.VendorCreateInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateInput>;
export const VendorCreateInputObjectZodSchema = makeSchema();
