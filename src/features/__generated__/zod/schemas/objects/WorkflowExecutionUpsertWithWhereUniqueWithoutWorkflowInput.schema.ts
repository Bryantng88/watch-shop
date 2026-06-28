import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema as WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUpdateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedUpdateWithoutWorkflowInput.schema';
import { WorkflowExecutionCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionCreateWithoutWorkflowInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkflowExecutionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateWithoutWorkflowInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowExecutionUpsertWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
