import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { ProductArgsObjectSchema as ProductArgsObjectSchema } from './ProductArgs.schema'

const makeSchema = () => z.object({
  id: z.boolean().optional(),
  productId: z.boolean().optional(),
  orderId: z.boolean().optional(),
  status: z.boolean().optional(),
  depositAmt: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  product: z.union([z.boolean(), z.lazy(() => ProductArgsObjectSchema)]).optional()
}).strict();
export const ReservationSelectObjectSchema: z.ZodType<Prisma.ReservationSelect> = makeSchema() as unknown as z.ZodType<Prisma.ReservationSelect>;
export const ReservationSelectObjectZodSchema = makeSchema();
