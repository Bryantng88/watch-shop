import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  AcquisitionItem: z.boolean().optional(),
  ServiceRequest: z.boolean().optional()
}).strict();
export const OrderItemCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.OrderItemCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.OrderItemCountOutputTypeSelect>;
export const OrderItemCountOutputTypeSelectObjectZodSchema = makeSchema();
