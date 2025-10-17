import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Invoice: z.boolean().optional(),
  maintenance: z.boolean().optional()
}).strict();
export const ServiceRequestCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ServiceRequestCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ServiceRequestCountOutputTypeSelect>;
export const ServiceRequestCountOutputTypeSelectObjectZodSchema = makeSchema();
