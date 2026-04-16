import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionFindManySchema as AcquisitionFindManySchema } from '../findManyAcquisition.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { OrderFindManySchema as OrderFindManySchema } from '../findManyOrder.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { CustomerCountOutputTypeArgsObjectSchema as CustomerCountOutputTypeArgsObjectSchema } from './CustomerCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  Acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionFindManySchema)]).optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  orders: z.union([z.boolean(), z.lazy(() => OrderFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CustomerCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CustomerIncludeObjectSchema: z.ZodType<Prisma.CustomerInclude> = makeSchema() as unknown as z.ZodType<Prisma.CustomerInclude>;
export const CustomerIncludeObjectZodSchema = makeSchema();
