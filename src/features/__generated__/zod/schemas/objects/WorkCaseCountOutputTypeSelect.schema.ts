import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  tasks: z.boolean().optional(),
  serviceRequests: z.boolean().optional(),
  activities: z.boolean().optional()
}).strict();
export const WorkCaseCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WorkCaseCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCountOutputTypeSelect>;
export const WorkCaseCountOutputTypeSelectObjectZodSchema = makeSchema();
