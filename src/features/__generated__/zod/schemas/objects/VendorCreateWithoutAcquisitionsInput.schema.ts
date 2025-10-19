import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
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
  updatedAt: z.coerce.date().optional(),
  Invoice: z.lazy(() => InvoiceCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  services: z.lazy(() => MaintenanceRecordCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorCreateWithoutAcquisitionsInputObjectSchema: z.ZodType<Prisma.VendorCreateWithoutAcquisitionsInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateWithoutAcquisitionsInput>;
export const VendorCreateWithoutAcquisitionsInputObjectZodSchema = makeSchema();
