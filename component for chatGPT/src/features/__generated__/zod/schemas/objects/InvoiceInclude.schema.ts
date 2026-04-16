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
  acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionArgsObjectSchema)]).optional(),
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  serviceReq: z.union([z.boolean(), z.lazy(() => ServiceRequestArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  items: z.union([z.boolean(), z.lazy(() => InvoiceItemFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => InvoiceCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const InvoiceIncludeObjectSchema: z.ZodType<Prisma.InvoiceInclude> = makeSchema() as unknown as z.ZodType<Prisma.InvoiceInclude>;
export const InvoiceIncludeObjectZodSchema = makeSchema();
