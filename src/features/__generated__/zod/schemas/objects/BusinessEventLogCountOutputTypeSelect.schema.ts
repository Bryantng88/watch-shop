import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  workflowEvents: z.boolean().optional()
}).strict();
export const BusinessEventLogCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.BusinessEventLogCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.BusinessEventLogCountOutputTypeSelect>;
export const BusinessEventLogCountOutputTypeSelectObjectZodSchema = makeSchema();
