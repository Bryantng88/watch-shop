import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema as WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUpdateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedUpdateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowExecutionUpdateWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
