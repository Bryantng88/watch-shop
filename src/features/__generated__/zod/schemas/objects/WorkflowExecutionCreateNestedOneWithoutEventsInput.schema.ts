import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionCreateWithoutEventsInputObjectSchema as WorkflowExecutionCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutEventsInput.schema';
import { WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema as WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateOrConnectWithoutEventsInput.schema';
import { WorkflowExecutionWhereUniqueInputObjectSchema as WorkflowExecutionWhereUniqueInputObjectSchema } from './WorkflowExecutionWhereUniqueInput.schema'

const makeSchema = () => z.object({
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema)]).optional(),
  connectOrCreate: z.lazy(() => WorkflowExecutionCreateOrConnectWithoutEventsInputObjectSchema).optional(),
  connect: z.lazy(() => WorkflowExecutionWhereUniqueInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionCreateNestedOneWithoutEventsInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionCreateNestedOneWithoutEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionCreateNestedOneWithoutEventsInput>;
export const WorkflowExecutionCreateNestedOneWithoutEventsInputObjectZodSchema = makeSchema();
