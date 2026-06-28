import * as z from 'zod';
import type { Prisma } from '@prisma/client';
import { WorkflowExecutionUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUpdateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedUpdateWithoutEventsInput.schema';
import { WorkflowExecutionCreateWithoutEventsInputObjectSchema as WorkflowExecutionCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionCreateWithoutEventsInput.schema';
import { WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema as WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema } from './WorkflowExecutionUncheckedCreateWithoutEventsInput.schema';
import { WorkflowExecutionWhereInputObjectSchema as WorkflowExecutionWhereInputObjectSchema } from './WorkflowExecutionWhereInput.schema'

const makeSchema = () => z.object({
  update: z.union([z.lazy(() => WorkflowExecutionUpdateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedUpdateWithoutEventsInputObjectSchema)]),
  create: z.union([z.lazy(() => WorkflowExecutionCreateWithoutEventsInputObjectSchema), z.lazy(() => WorkflowExecutionUncheckedCreateWithoutEventsInputObjectSchema)]),
  where: z.lazy(() => WorkflowExecutionWhereInputObjectSchema).optional()
}).strict();
export const WorkflowExecutionUpsertWithoutEventsInputObjectSchema: z.ZodType<Prisma.WorkflowExecutionUpsertWithoutEventsInput> = makeSchema() as unknown as z.ZodType<Prisma.WorkflowExecutionUpsertWithoutEventsInput>;
export const WorkflowExecutionUpsertWithoutEventsInputObjectZodSchema = makeSchema();
