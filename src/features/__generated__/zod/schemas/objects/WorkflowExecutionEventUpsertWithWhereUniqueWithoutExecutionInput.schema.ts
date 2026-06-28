import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventWhereUniqueInputObjectSchema as WorkflowExecutionEventWhereUniqueInputObjectSchema } from './WorkflowExecutionEventWhereUniqueInput.schema';
import { WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUpdateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateWithoutExecutionInput.schema';
import { WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventCreateWithoutExecutionInput.schema';
import { WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema as WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema } from './WorkflowExecutionEventUncheckedCreateWithoutExecutionInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventWhereUniqueInputObjectSchema),
  update: z.union([z.lazy(() => WorkflowExecutionEventUpdateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateWithoutExecutionInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowExecutionEventCreateWithoutExecutionInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedCreateWithoutExecutionInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInput>;
export const WorkflowExecutionEventUpsertWithWhereUniqueWithoutExecutionInputObjectZodSchema = makeSchema();
