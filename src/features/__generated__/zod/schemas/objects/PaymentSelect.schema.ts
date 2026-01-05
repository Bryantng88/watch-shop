import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.boolean().optional(),
  method: z.boolean().optional(),
  amount: z.boolean().optional(),
  currency: z.boolean().optional(),
  paidAt: z.boolean().optional(),
  reference: z.boolean().optional(),
  note: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  direction: z.boolean().optional(),
  status: z.boolean().optional(),
  order_id: z.boolean().optional(),
  service_request_id: z.boolean().optional(),
  vendor_id: z.boolean().optional(),
  acquisition_id: z.boolean().optional()
}).strict();
export const PaymentSelectObjectSchema: z.ZodType<Prisma.PaymentSelect> = makeSchema() as unknown as z.ZodType<Prisma.PaymentSelect>;
export const PaymentSelectObjectZodSchema = makeSchema();
