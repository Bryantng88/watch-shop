import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateOrConnectWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateOrConnectWithoutWorkflowInput>;
export const WorkflowExecutionCreateOrConnectWithoutWorkflowInputObjectZodSchema = makeSchema();
