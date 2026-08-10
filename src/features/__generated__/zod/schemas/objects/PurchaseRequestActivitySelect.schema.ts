import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { PurchaseRequestArgsObjectSchema as PurchaseRequestArgsObjectSchema } from './PurchaseRequestArgs.schema';
import { UserArgsObjectSchema as UserArgsObjectSchema } from './UserArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  purchaseRequestId: z.boolean().optional(),
  type: z.boolean().optional(),
  note: z.boolean().optional(),
  actorUserId: z.boolean().optional(),
  followUpAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  purchaseRequest: z.union([z.boolean(), z.lazy(() => PurchaseRequestArgsObjectSchema)]).optional(),
  actor: z.union([z.boolean(), z.lazy(() => UserArgsObjectSchema)]).optional()
}).strict();
export const PurchaseRequestActivitySelectObjectSchema: z.ZodType<Prisma.PurchaseRequestActivitySelect> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestActivitySelect>;
export const PurchaseRequestActivitySelectObjectZodSchema = makeSchema();
