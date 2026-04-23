import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  logs: z.boolean().optional()
}).strict();
export const AcquisitionSpecJobCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.AcquisitionSpecJobCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.AcquisitionSpecJobCountOutputTypeSelect>;
export const AcquisitionSpecJobCountOutputTypeSelectObjectZodSchema = makeSchema();
