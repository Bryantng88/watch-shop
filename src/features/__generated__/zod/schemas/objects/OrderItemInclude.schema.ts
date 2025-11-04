import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { AcquisitionItemFindManySchema as AcquisitionItemFindManySchema } from '../findManyAcquisitionItem.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema';
import { ServiceRequestFindManySchema as ServiceRequestFindManySchema } from '../findManyServiceRequest.schema';
import { OrderItemCountOutputTypeArgsObjectSchema as OrderItemCountOutputTypeArgsObjectSchema } from './OrderItemCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  acquisitionItem: z.union([z.boolean(), z.lazy(() => AcquisitionItemFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  Product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional(),
  serviceRequest: z.union([z.boolean(), z.lazy(() => ServiceRequestFindManySchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => OrderItemCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const OrderItemIncludeObjectSchema: z.ZodType<Prisma.OrderItemInclude> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemInclude>;
export const OrderItemIncludeObjectZodSchema = makeSchema();
