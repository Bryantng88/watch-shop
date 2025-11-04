import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  acquisitions: z.boolean().optional(),
  invoice: z.boolean().optional(),
  services: z.boolean().optional(),
  Product: z.boolean().optional()
}).strict();
export const VendorCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.VendorCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.VendorCountOutputTypeSelect>;
export const VendorCountOutputTypeSelectObjectZodSchema = makeSchema();
