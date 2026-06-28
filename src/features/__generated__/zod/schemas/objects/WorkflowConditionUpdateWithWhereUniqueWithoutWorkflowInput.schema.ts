import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionUpdateWithoutWorkflowInputObjectSchema as WorkflowConditionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUpdateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedUpdateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowConditionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowConditionUpdateWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
