import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  acquisitionItem: z.boolean().optional(),
  invoice: z.boolean().optional()
}).strict();
export const AcquisitionCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.AcquisitionCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionCountOutputTypeSelect>;
export const AcquisitionCountOutputTypeSelectObjectZodSchema = makeSchema();
