import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  Task: z.boolean().optional()
}).strict();
export const ShipmentCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.ShipmentCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.ShipmentCountOutputTypeSelect>;
export const ShipmentCountOutputTypeSelectObjectZodSchema = makeSchema();
