import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateOrConnectWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateOrConnectWithoutExecutionInput>;
export const WorkflowExecutionEventCreateOrConnectWithoutExecutionInputObjectZodSchema = makeSchema();
