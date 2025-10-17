import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Acquisition: z.boolean().optional(),
  Invoice: z.boolean().optional(),
  orders: z.boolean().optional(),
  ServiceRequest: z.boolean().optional()
}).strict();
export const CustomerCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.CustomerCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.CustomerCountOutputTypeSelect>;
export const CustomerCountOutputTypeSelectObjectZodSchema = makeSchema();
