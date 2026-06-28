import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema';
import { WorkflowExecutionCreateWithoutEventsInputObjectSchema as WorkflowExecutionCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutEventsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema),
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema)])
}).strict();
export const WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateOrConnectWithoutEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateOrConnectWithoutEventsInput>;
export const WorkflowExecutionCreateOrConnectWithoutEventsInputObjectZodSchema = makeSchema();
