import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowConditionWhereUniqueInputObjectSchema as WorkflowConditionWhereUniqueInputObjectSchema } from './WorkflowConditionWhereUniqueInput.schema';
import { WorkflowConditionCreateWithoutWorkflowInputObjectSchema as WorkflowConditionCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionCreateWithoutWorkflowInput.schema';
import { WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowConditionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowConditionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowConditionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowConditionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowConditionCreateOrConnectWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowConditionCreateOrConnectWithoutWorkflowInput>;
export const WorkflowConditionCreateOrConnectWithoutWorkflowInputObjectZodSchema = makeSchema();
