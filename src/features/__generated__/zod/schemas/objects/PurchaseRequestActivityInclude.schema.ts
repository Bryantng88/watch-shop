import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional(),
  actor: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestActivityIncludeObjectSchema: z.ZodType<Prisma.PurchaseRequestActivityInclude> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivityInclude>;
export const PurchaseRequestActivityIncludeObjectZodSchema = makeSchema();
