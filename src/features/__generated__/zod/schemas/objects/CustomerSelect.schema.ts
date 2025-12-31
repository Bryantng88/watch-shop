import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionFindManySchema as AcquisitionFindManySchema } from '../findManyAcquisition.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { InvoiceFindManySchema as InvoiceFindManySchema } from '../findManyInvoice.schema';
import { OrderFindManySchema as OrderFindManySchema } from '../findManyOrder.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { CustomerCountOutputTypeArgsObjectSchema as CustomerCountOutputTypeArgsObjectSchema } from './CustomerCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  phone: z.boolean().optional(),
  ward: z.boolean().optional(),
  city: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  address: z.boolean().optional(),
  district: z.boolean().optional(),
  Acquisition: z.union([z.boolean(), z.lazy(() => AcquisitionFindManySchema)]).optional(),
  user: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  Invoice: z.union([z.boolean(), z.lazy(() => InvoiceFindManySchema)]).optional(),
  orders: z.union([z.boolean(), z.lazy(() => OrderFindManySchema)]).optional(),
  ServiceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => CustomerCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const CustomerSelectObjectSchema: z.ZodType<Prisma.CustomerSelect> = makeSchema() as unknown as z.ZodType<Prisma.CustomerSelect>;
export const CustomerSelectObjectZodSchema = makeSchema();
