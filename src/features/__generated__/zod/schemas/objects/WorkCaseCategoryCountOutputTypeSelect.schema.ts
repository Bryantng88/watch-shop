import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  workCases: z.boolean().optional()
}).strict();
export const WorkCaseCategoryCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.WorkCaseCategoryCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryCountOutputTypeSelect>;
export const WorkCaseCategoryCountOutputTypeSelectObjectZodSchema = makeSchema();
