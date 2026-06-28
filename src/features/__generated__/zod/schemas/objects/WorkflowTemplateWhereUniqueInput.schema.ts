import * as z from 'zod';
import type { Prisma } from '@prisma/client';


const makeSchema = () => z.object({
  id: z.string().optional()
}).strict();
export const WorkflowTemplateWhereUniqueInputObjectSchema: z.ZodType<Prisma.WorkflowTemplateWhereUniqueInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowTemplateWhereUniqueInput>;
export const WorkflowTemplateWhereUniqueInputObjectZodSchema = makeSchema();
