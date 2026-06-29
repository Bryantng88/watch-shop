import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUpdateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventCreateWithoutBusinessEventLogInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateWithoutBusinessEventLogInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutBusinessEventLogInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventUpsertWithWhereUniqueWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
