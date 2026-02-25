import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  MaintenanceRecord: z.boolean().optional()
}).strict();
export const PaymentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.PaymentCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.PaymentCountOutputTypeSelect>;
export const PaymentCountOutputTypeSelectObjectZodSchema = makeSchema();
