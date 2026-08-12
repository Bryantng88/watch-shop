import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  items: z.boolean().optional(),
  activities: z.boolean().optional(),
  ingressReceipts: z.boolean().optional()
}).strict();
export const PurchaseRequestCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PurchaseRequestCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.PurchaseRequestCountOutputTypeSelect>;
export const PurchaseRequestCountOutputTypeSelectObjectZodSchema = makeSchema();
