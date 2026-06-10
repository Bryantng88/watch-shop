import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WorkCaseActivityWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkCaseActivityWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseActivityWhereUniqueInput>;
export const WorkCaseActivityWhereUniqueInputObjectZodSchema = makeSchema();
