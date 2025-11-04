import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { VendorRoleSchema } from '../enums/VendorRole.schema';
import { AcquisitionCreateNestedManyWithoutVendorInputObjectSchema as AcquisitionCreateNestedManyWithoutVendorInputObjectSchema } from './AcquisitionCreateNestedManyWithoutVendorInput.schema';
import { InvoiceCreateNestedManyWithoutVendorInputObjectSchema as InvoiceCreateNestedManyWithoutVendorInputObjectSchema } from './InvoiceCreateNestedManyWithoutVendorInput.schema';
import { ProductCreateNestedManyWithoutVendorInputObjectSchema as ProductCreateNestedManyWithoutVendorInputObjectSchema } from './ProductCreateNestedManyWithoutVendorInput.schema'

const makeSchema = () => z.object({
  id: z.string().optional(),
  name: z.string(),
  role: VendorRoleSchema.optional(),
  isAuthorized: z.boolean().optional(),
  email: z.string().optional().nullable(),
  phone: z.string(),
  address: z.string().optional().nullable(),
  note: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  acquisitions: z.lazy(() => AcquisitionCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  invoice: z.lazy(() => InvoiceCreateNestedManyWithoutVendorInputObjectSchema).optional(),
  Product: z.lazy(() => ProductCreateNestedManyWithoutVendorInputObjectSchema).optional()
}).strict();
export const VendorCreateWithoutServicesInputObjectSchema: z.ZodType<Prisma.VendorCreateWithoutServicesInput> = makeSchema() as unknown as z.ZodType<Prisma.VendorCreateWithoutServicesInput>;
export const VendorCreateWithoutServicesInputObjectZodSchema = makeSchema();
