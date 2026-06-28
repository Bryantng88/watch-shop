import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowTemplateArgsObjectSchema as WorkflowTemplateArgsObjectSchema } from './WorkflowTemplateArgs.schema'

const makeSchema = () => z.object({
  workflow: z.union([z.boolean(), z.lazy(() => WorkflowTemplateArgsObjectSchema)]).optional()
}).strict();
export const WorkflowActionIncludeObjectSchema: z.ZodType<Prisma.WorkflowActionInclude> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionInclude>;
export const WorkflowActionIncludeObjectZodSchema = makeSchema();
