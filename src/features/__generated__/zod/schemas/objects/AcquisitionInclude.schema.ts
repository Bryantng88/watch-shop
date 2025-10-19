import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { CustomerArgsObjectSchema as CustomerArgsObjectSchema } from './CustomerArgs.schema';
import { VendorArgsObjectSchema as VendorArgsObjectSchema } from './VendorArgs.schema';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { AcquisitionCountOutputTypeArgsObjectSchema as AcquisitionCountOutputTypeArgsObjectSchema } from './AcquisitionCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  customer: z.union([z.boolean(), z.lazy(() => CustomerArgsObjectSchema)]).optional(),
  vendor: z.union([z.boolean(), z.lazy(() => VendorArgsObjectSchema)]).optional(),
  AcquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => AcquisitionCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const AcquisitionIncludeObjectSchema: z.ZodType<Prisma.AcquisitionInclude> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionInclude>;
export const AcquisitionIncludeObjectZodSchema = makeSchema();
