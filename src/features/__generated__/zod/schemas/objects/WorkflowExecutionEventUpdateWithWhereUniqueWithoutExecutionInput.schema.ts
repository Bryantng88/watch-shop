import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUpdateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateWithoutExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInput>;
export const WorkflowExecutionEventUpdateWithWhereUniqueWithoutExecutionInputObjectZodSchema = makeSchema();
