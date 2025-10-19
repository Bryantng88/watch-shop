import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Invoice: z.boolean().optional(),
  items: z.boolean().optional()
}).strict();
export const OrderCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.OrderCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderCountOutputTypeSelect>;
export const OrderCountOutputTypeSelectObjectZodSchema = makeSchema();
