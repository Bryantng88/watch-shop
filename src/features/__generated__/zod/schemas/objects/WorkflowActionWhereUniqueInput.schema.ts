import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WorkflowActionWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowActionWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionWhereUniqueInput>;
export const WorkflowActionWhereUniqueInputObjectZodSchema = makeSchema();
