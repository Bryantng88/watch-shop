import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  code: z.string().optional()
}).strict();
export const WorkCaseCategoryWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkCaseCategoryWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseCategoryWhereUniqueInput>;
export const WorkCaseCategoryWhereUniqueInputObjectZodSchema = makeSchema();
