import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './WorkflowExecutionWhereInput.schema';
import { WorkflowExecutionUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUpdateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedUpdateWithoutEventsInput.schema'

const makeSchema = () => z.object({
  where: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional(),
  data: z.union([z.lazy(() => WorkflowExecutionUpdateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema)])
}).strict();
export const WorkflowExecutionUpdateToOneWithWhereWithoutEventsInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpdateToOneWithWhereWithoutEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpdateToOneWithWhereWithoutEventsInput>;
export const WorkflowExecutionUpdateToOneWithWhereWithoutEventsInputObjectZodSchema = makeSchema();
