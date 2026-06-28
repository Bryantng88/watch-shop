import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionUpdateWithoutWorkflowInputObjectSchema as WorkflowConditionUpdateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUpdateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedUpdateWithoutWorkflowInput.schema';
import { WorkflowConditionCreateWithoutWorkflowInputObjectSchema as WorkflowConditionCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkflowConditionUpdateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedUpdateWithoutWorkflowInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInput>;
export const WorkflowConditionUpsertWithWhereUniqueWithoutWorkflowInputObjectZodSchema = makeSchema();
