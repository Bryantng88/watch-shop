import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionUpdateWithoutWorkflowInputObjectSchema as WorkflowActionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowActionUpdateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedUpdateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowActionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedUpdateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowActionUpdateWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
