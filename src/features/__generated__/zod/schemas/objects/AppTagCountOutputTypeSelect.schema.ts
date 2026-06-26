import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  links: z.boolean().optional()
}).strict();
export const AppTagCountOutputTypeSelectObjectSchema: z.ZodType<Prisma.AppTagCountOutputTypeSelect> = makeSchema() as unknown as z.ZodType<Prisma.AppTagCountOutputTypeSelect>;
export const AppTagCountOutputTypeSelectObjectZodSchema = makeSchema();
