import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional(),
  refNo: z.string().optional()
}).strict();
export const WorkCaseWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkCaseWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkCaseWhereUniqueInput>;
export const WorkCaseWhereUniqueInputObjectZodSchema = makeSchema();
