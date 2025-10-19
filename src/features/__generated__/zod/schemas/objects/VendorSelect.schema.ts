import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionFindManySchema as AcquisitionFindManySchema } from '../findManyAcquisition.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { MaintenanceRecordFindManySchema as MaintenanceRecordFindManySchema } from '../findManyMaintenanceRecord.schema';
import { ProductFindManySchema as ProductFindManySchema } from '../findManyProduct.schema';
import { VendorCountOutputTypeArgsObjectSchema as VendorCountOutputTypeArgsObjectSchema } from './VendorCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  role: z.boolean().optional(),
  isAuthorized: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  address: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  acquisitions: z.union([z.boolean(), z.lazy(() => AcquisitionFindManySchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  services: z.union([z.boolean(), z.lazy(() => MaintenanceRecordFindManySchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => VendorCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const VendorSelectObjectSchema: z.ZodType<Prisma.VendorSelect> = makeSchema() as unknown as z.ZodType<Prisma.VendorSelect>;
export const VendorSelectObjectZodSchema = makeSchema();
