import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUpdateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventUpdateWithWhereUniqueWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
