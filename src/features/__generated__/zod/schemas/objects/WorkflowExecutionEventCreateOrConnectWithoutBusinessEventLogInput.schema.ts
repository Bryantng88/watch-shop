import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventCreateOrConnectWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
