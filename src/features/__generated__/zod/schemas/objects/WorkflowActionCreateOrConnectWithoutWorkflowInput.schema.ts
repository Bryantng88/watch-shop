import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowActionWhereUniqueInputObjectSchema as WorkflowActionWhereUniqueInputObjectSchema } from './WorkflowActionWhereUniqueInput.schema';
import { WorkflowActionCreateWithoutWorkflowInputObjectSchema as WorkflowActionCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionCreateWithoutWorkflowInput.schema';
import { WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema as WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema } from './WorkflowActionUncheckedCreateWithoutWorkflowInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowActionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowActionCreateWithoutWorkflowInputObjectSchema), z.lazy(() => WorkflowActionUncheckedCreateWithoutWorkflowInputObjectSchema)])
}).strict();
export const WorkflowActionCreateOrConnectWithoutWorkflowInputObjectSchema: z.ZodType<Prisma.WorkflowActionCreateOrConnectWithoutWorkflowInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowActionCreateOrConnectWithoutWorkflowInput>;
export const WorkflowActionCreateOrConnectWithoutWorkflowInputObjectZodSchema = makeSchema();
