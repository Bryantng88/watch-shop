import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionArgsObjectSchema as AcquisitionArgsObjectSchema } from './AcquisitionArgs.schema';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ServiceRequestArgsObjectSchema as ServiceRequestArgsObjectSchema } from './ServiceRequestArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { InvoiceItemFindManySchema as InvoiceItemFindManySchema } from '../findManyInvoiceItem.schema';
import { InvoiceCountOutputTypeArgsObjectSchema as InvoiceCountOutputTypeArgsObjectSchema } from './InvoiceCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  code: z.boolean().optional(),
  type: z.boolean().optional(),
  status: z.boolean().optional(),
  customerId: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  acquisitionId: z.boolean().optional(),
  serviceRequestId: z.boolean().optional(),
  currency: z.boolean().optional(),
  subTotal: z.boolean().optional(),
  taxTotal: z.boolean().optional(),
  discountTotal: z.boolean().optional(),
  grandTotal: z.boolean().optional(),
  issuedAt: z.boolean().optional(),
  dueAt: z.boolean().optional(),
  notes: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  serviceReq: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  items: z.union([z.boolean(), z.lazy(() => InvoiceItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => InvoiceCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const InvoiceSelectObjectSchema: z.ZodType<Prisma.InvoiceSelect> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceSelect>;
export const InvoiceSelectObjectZodSchema = makeSchema();
