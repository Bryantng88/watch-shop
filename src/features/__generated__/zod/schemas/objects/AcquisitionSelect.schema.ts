import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { AcquisitionCountOutputTypeArgsObjectSchema as AcquisitionCountOutputTypeArgsObjectSchema } from './AcquisitionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  customerId: z.boolean().optional(),
  type: z.boolean().optional(),
  acquiredAt: z.boolean().optional(),
  cost: z.boolean().optional(),
  currency: z.boolean().optional(),
  payoutStatus: z.boolean().optional(),
  accquisitionStt: z.boolean().optional(),
  refNo: z.boolean().optional(),
  notes: z.boolean().optional(),
  condition: z.boolean().optional(),
  warrantyUntil: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  AcquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcquisitionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionSelectObjectSchema: z.ZodType<Prisma.AcquisitionSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSelect>;
export const AcquisitionSelectObjectZodSchema = makeSchema();
