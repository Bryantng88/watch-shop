import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionEventScalarWhereInputObjectSchema as WorkflowExecutionEventScalarWhereInputObjectSchema } from './WorkflowExecutionEventScalarWhereInput.schema';
import { WorkflowExecutionEventUpdateManyMutationInputObjectSchema as WorkflowExecutionEventUpdateManyMutationInputObjectSchema } from './WorkflowExecutionEventUpdateManyMutationInput.schema';
import { WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema as WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema } from './WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionEventScalarWhereInputObjectSchema),
  data: z.union([z.lazy(() => WorkflowExecutionEventUpdateManyMutationInputObjectSchema), z.lazy(() => WorkflowExecutionEventUncheckedUpdateManyWithoutBusinessEventLogInputObjectSchema)])
}).strict();
export const WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInput>;
export const WorkflowExecutionEventUpdateManyWithWhereWithoutBusinessEventLogInputObjectZodSchema = makeSchema();
