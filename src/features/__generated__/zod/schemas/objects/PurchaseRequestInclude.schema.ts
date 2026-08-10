import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestItemFindManySchema as PurchaseRequestItemFindManySchema } from '../findManyPurchaseRequestItem.schema';
import { PurchaseRequestActivityFindManySchema as PurchaseRequestActivityFindManySchema } from '../findManyPurchaseRequestActivity.schema';
import { OrderArgsObjectSchema as OrderArgsObjectSchema } from './OrderArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema';
import { PurchaseRequestCountOutputTypeArgsObjectSchema as PurchaseRequestCountOutputTypeArgsObjectSchema } from './PurchaseRequestCountOutputTypeArgs.schema'

const makeSchema = () => z.object({
  items: z.union([z.boolean(), z.lazy(() => PurchaseRequestItemFindManySchema)]).optional(),
  activities: z.union([z.boolean(), z.lazy(() => PurchaseRequestActivityFindManySchema)]).optional(),
  order: z.union([z.boolean(), z.lazy(() => OrderArgsObjectSchema)]).optional(),
  assignedUser: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional(),
  _count: z.union([z.boolean(), z.lazy(() => PurchaseRequestCountOutputTypeArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestIncludeObjectSchema: z.ZodType<Prisma.PurchaseRequestInclude> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestInclude>;
export const PurchaseRequestIncludeObjectZodSchema = makeSchema();
